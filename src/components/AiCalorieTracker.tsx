import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Check,
  Plus,
  Flame,
  Info,
  Sliders,
  Clock,
  Bell,
  Trash2,
  RefreshCw,
  Utensils,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, MealType, UserProfile } from '../types';
import { DEMO_FOOD_LIBRARY } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface AiCalorieTrackerProps {
  user: UserProfile;
  foodItems: FoodItem[];
  onAddFoodItem: (item: FoodItem) => void;
  onDeleteFoodItem: (id: string) => void;
  onUpdatePoints: (pts: number) => void;
}

export const AiCalorieTracker: React.FC<AiCalorieTrackerProps> = ({
  user,
  foodItems,
  onAddFoodItem,
  onDeleteFoodItem,
  onUpdatePoints
}) => {
  // Scanner state
  const [selectedImage, setSelectedImage] = useState<string>(DEMO_FOOD_LIBRARY[0].image);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>({
    foodName: DEMO_FOOD_LIBRARY[0].name,
    category: DEMO_FOOD_LIBRARY[0].category,
    baseCalories: DEMO_FOOD_LIBRARY[0].calories,
    baseProtein: DEMO_FOOD_LIBRARY[0].proteinG,
    baseCarbs: DEMO_FOOD_LIBRARY[0].carbsG,
    baseFat: DEMO_FOOD_LIBRARY[0].fatG,
    baseFiber: DEMO_FOOD_LIBRARY[0].fiberG,
    glycemicIndex: DEMO_FOOD_LIBRARY[0].glycemicIndex,
    healthScore: DEMO_FOOD_LIBRARY[0].healthScore,
    portionMultiplier: 1.0,
    detectedIngredients: ['Whole grain sourdough (60g)', 'Pasture-raised poached egg (50g)', 'Fresh Hass avocado (70g)', 'Chia garnish']
  });

  const [mealType, setMealType] = useState<MealType>('lunch');
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1.0);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Live OpenFoodFacts Barcode State
  const [barcodeInput, setBarcodeInput] = useState<string>('3017624010701');
  const [isOpenFoodLoading, setIsOpenFoodLoading] = useState<boolean>(false);
  const [openFoodResult, setOpenFoodResult] = useState<any>(null);

  // Live TheMealDB Recipes State
  const [liveMeals, setLiveMeals] = useState<any[]>([]);
  const [isMealsLoading, setIsMealsLoading] = useState<boolean>(false);
  const [activeTabSub, setActiveTabSub] = useState<'camera' | 'barcode' | 'recipes'>('camera');

  // Fetch OpenFoodFacts live data
  const handleFetchBarcode = async (codeToFetch?: string) => {
    const code = codeToFetch || barcodeInput;
    setIsOpenFoodLoading(true);
    playBeep('short');
    try {
      const res = await fetch(`/api/openfoodfacts?barcode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data?.product) {
        setOpenFoodResult(data.product);
        const nutriments = data.product.nutriments || {};
        const cal = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 539);
        const p = Math.round(nutriments['proteins_100g'] || 6);
        const c = Math.round(nutriments['carbohydrates_100g'] || 57);
        const f = Math.round(nutriments['fat_100g'] || 30);
        const fiber = Math.round(nutriments['fiber_100g'] || 3);
        const score = data.product.nutriscore_grade?.toUpperCase() || 'E';

        setScanResult({
          foodName: data.product.product_name || `Product (${code})`,
          category: 'Snack',
          baseCalories: cal,
          baseProtein: p,
          baseCarbs: c,
          baseFat: f,
          baseFiber: fiber,
          glycemicIndex: score === 'A' || score === 'B' ? 'Low' : 'High',
          healthScore: score === 'A' ? 95 : score === 'B' ? 82 : score === 'C' ? 65 : 45,
          portionMultiplier: 1.0,
          detectedIngredients: [
            `Brand: ${data.product.brands || 'OpenFoodFacts Item'}`,
            `Nutri-Score Grade: Grade ${score}`,
            `Barcode: ${code}`,
            data.product.ingredients_text ? `Ingredients: ${data.product.ingredients_text.slice(0, 100)}...` : 'Nutrient composition sourced live from OpenFoodFacts'
          ]
        });

        if (data.product.image_url) {
          setSelectedImage(data.product.image_url);
        }
        playBeep('start');
      }
    } catch (err) {
      console.error('OpenFoodFacts fetch error:', err);
    } finally {
      setIsOpenFoodLoading(false);
    }
  };

  // Fetch TheMealDB live recipes
  const handleFetchLiveMeals = async () => {
    setIsMealsLoading(true);
    playBeep('short');
    try {
      const res = await fetch('/api/meals?i=chicken_breast');
      const data = await res.json();
      if (data?.meals) {
        setLiveMeals(data.meals.slice(0, 6));
        playBeep('start');
      }
    } catch (err) {
      console.error('TheMealDB fetch error:', err);
    } finally {
      setIsMealsLoading(false);
    }
  };

  // File upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImage(imageUrl);
        simulateAiScan(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  // Pick sample food
  const handleSelectSample = (sample: typeof DEMO_FOOD_LIBRARY[0]) => {
    setSelectedImage(sample.image);
    simulateAiScan(sample.name, sample);
  };

  const simulateAiScan = (hintName: string, sampleData?: typeof DEMO_FOOD_LIBRARY[0]) => {
    setIsScanning(true);
    playBeep('short');

    setTimeout(() => {
      setIsScanning(false);
      setPortionMultiplier(1.0);

      if (sampleData) {
        setScanResult({
          foodName: sampleData.name,
          category: sampleData.category,
          baseCalories: sampleData.calories,
          baseProtein: sampleData.proteinG,
          baseCarbs: sampleData.carbsG,
          baseFat: sampleData.fatG,
          baseFiber: sampleData.fiberG,
          glycemicIndex: sampleData.glycemicIndex,
          healthScore: sampleData.healthScore,
          portionMultiplier: 1.0,
          detectedIngredients: [
            'Recognized dish: ' + sampleData.name,
            'Balanced macronutrient distribution',
            'Nutrient-dense whole ingredients',
            'Portion scale: ' + sampleData.portion
          ]
        });
      } else {
        // Dynamic recognized estimation
        setScanResult({
          foodName: hintName || 'Healthy Balanced Meal Plate',
          category: 'Lunch',
          baseCalories: 450,
          baseProtein: 32,
          baseCarbs: 45,
          baseFat: 14,
          baseFiber: 6,
          glycemicIndex: 'Low',
          healthScore: 92,
          portionMultiplier: 1.0,
          detectedIngredients: [
            'Lean protein portion (approx 150g)',
            'Complex carbohydrate base (approx 120g)',
            'Steamed dietary vegetable greens',
            'Healthy monounsaturated fat dressing'
          ]
        });
      }
      playBeep('start');
    }, 1200);
  };

  // Add to Diary
  const handleLogMeal = () => {
    if (!scanResult) return;

    const calculatedCalories = Math.round(scanResult.baseCalories * portionMultiplier);
    const calculatedProtein = Math.round(scanResult.baseProtein * portionMultiplier);
    const calculatedCarbs = Math.round(scanResult.baseCarbs * portionMultiplier);
    const calculatedFat = Math.round(scanResult.baseFat * portionMultiplier);
    const calculatedFiber = Math.round(scanResult.baseFiber * portionMultiplier);

    const newFood: FoodItem = {
      id: 'food-' + Date.now(),
      name: scanResult.foodName,
      mealType: mealType,
      calories: calculatedCalories,
      proteinG: calculatedProtein,
      carbsG: calculatedCarbs,
      fatG: calculatedFat,
      fiberG: calculatedFiber,
      glycemicIndex: scanResult.glycemicIndex,
      portionSize: `${Math.round(portionMultiplier * 100)}% standard serving`,
      imageUrl: selectedImage,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiAnalyzed: true,
      healthScore: scanResult.healthScore,
      notes: `AI Scanned with ${scanResult.glycemicIndex} Glycemic Impact. Portion: ${portionMultiplier}x`
    };

    onAddFoodItem(newFood);
    onUpdatePoints(user.fitPoints + 50);
    playBeep('reward');

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Toggle Calorie Reminder Notification
  const triggerReminderTest = () => {
    setReminderToast("⏰ Duolingo Streak Alert: Don't forget to photograph your dinner before 8:00 PM to protect your 19-day streak!");
    setTimeout(() => setReminderToast(null), 5000);
  };

  // Current calculated macros
  const currentCalories = Math.round((scanResult?.baseCalories || 0) * portionMultiplier);
  const currentProtein = Math.round((scanResult?.baseProtein || 0) * portionMultiplier);
  const currentCarbs = Math.round((scanResult?.baseCarbs || 0) * portionMultiplier);
  const currentFat = Math.round((scanResult?.baseFat || 0) * portionMultiplier);
  const currentFiber = Math.round((scanResult?.baseFiber || 0) * portionMultiplier);

  // Group diary items by meal type
  const mealsByType: Record<MealType, FoodItem[]> = {
    breakfast: foodItems.filter((i) => i.mealType === 'breakfast'),
    lunch: foodItems.filter((i) => i.mealType === 'lunch'),
    dinner: foodItems.filter((i) => i.mealType === 'dinner'),
    snack: foodItems.filter((i) => i.mealType === 'snack')
  };

  const totalCaloriesLogged = foodItems.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {reminderToast && (
        <div className="p-4 rounded-xl bg-orange-600 text-white font-medium text-xs shadow-lg flex items-center justify-between animate-bounce">
          <span>{reminderToast}</span>
          <button onClick={() => setReminderToast(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">AI Calorie Tracker & Food Vision</h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Gemini Vision Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload or photograph your meal. Our optical engine estimates portions, calories, macros, and glycemic index to protect your blood sugar and weight goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerReminderTest}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-orange-500" />
            <span>Test Streak Reminder</span>
          </button>
        </div>
      </div>

      {/* Source Switcher: Camera / OpenFoodFacts Live / TheMealDB Live */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTabSub('camera')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTabSub === 'camera'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>AI Photo Vision</span>
        </button>

        <button
          onClick={() => {
            setActiveTabSub('barcode');
            if (!openFoodResult) handleFetchBarcode('3017624010701');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTabSub === 'barcode'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>OpenFoodFacts Live</span>
        </button>

        <button
          onClick={() => {
            setActiveTabSub('recipes');
            if (liveMeals.length === 0) handleFetchLiveMeals();
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTabSub === 'recipes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-amber-600" />
          <span>TheMealDB Recipes</span>
        </button>
      </div>

      {/* Barcode Search Panel when active */}
      {activeTabSub === 'barcode' && (
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Live Serverless Integration</span>
            <p className="text-xs font-bold text-slate-900">Query OpenFoodFacts Global Barcode Database (/api/openfoodfacts)</p>
            <p className="text-[11px] text-slate-600">Try default Nutella code: 3017624010701 or any supermarket EAN/UPC</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter barcode..."
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono w-44"
            />
            <button
              onClick={() => handleFetchBarcode()}
              disabled={isOpenFoodLoading}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOpenFoodLoading ? 'animate-spin' : ''}`} />
              <span>{isOpenFoodLoading ? 'Querying...' : 'Fetch Live Barcode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TheMealDB Live Recipes Panel when active */}
      {activeTabSub === 'recipes' && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Live Serverless Integration</span>
              <p className="text-xs font-bold text-slate-900">Live Healthy Meal Inspirations from TheMealDB (/api/meals?i=chicken_breast)</p>
            </div>
            <button
              onClick={handleFetchLiveMeals}
              disabled={isMealsLoading}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isMealsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Recipes</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {liveMeals.map((meal) => (
              <div
                key={meal.idMeal}
                onClick={() => {
                  setSelectedImage(meal.strMealThumb);
                  setScanResult({
                    foodName: meal.strMeal,
                    category: 'Dinner',
                    baseCalories: 460,
                    baseProtein: 38,
                    baseCarbs: 35,
                    baseFat: 12,
                    baseFiber: 5,
                    glycemicIndex: 'Low',
                    healthScore: 92,
                    portionMultiplier: 1.0,
                    detectedIngredients: [
                      `Live TheMealDB Recipe #${meal.idMeal}`,
                      'Lean chicken breast base',
                      'Low-fat culinary seasoning'
                    ]
                  });
                  playBeep('start');
                }}
                className="bg-white p-2 rounded-xl border border-amber-200/80 hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer group"
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <p className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-1.5 group-hover:text-amber-700">
                  {meal.strMeal}
                </p>
                <p className="text-[10px] text-slate-400">Tap to load & log</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Scanner Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Uploader & Optical Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {activeTabSub === 'barcode' ? 'OpenFoodFacts Product Image' : 'Food Photograph'}
              </span>
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Food Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Photo viewport with visual scanning overlay */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
              <img
                src={selectedImage}
                alt="Meal to analyze"
                className={`w-full h-full object-cover transition-all duration-500 ${isScanning ? 'blur-xs brightness-75' : ''}`}
              />

              {/* Optical Bounding overlay */}
              {!isScanning && (
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 font-mono text-[11px] px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                      AI Vision Bounding · 98.4% Confidence
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] px-2 py-1 rounded-md border border-white/20">
                      GI: {scanResult.glycemicIndex}
                    </span>
                  </div>

                  <div className="bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white max-w-sm">
                    <p className="text-xs font-bold text-white">{scanResult.foodName}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">{scanResult.detectedIngredients?.[0]}</p>
                  </div>
                </div>
              )}

              {/* Scanning Active Animation */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs text-white">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-3"></div>
                  <p className="text-xs font-bold tracking-wide">Deconstructing Optical Macronutrients...</p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-1">Cross-referencing Health Promotion Board database</p>
                </div>
              )}
            </div>

            {/* Quick Demo Pre-sets */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-600 mb-2">Or choose a sample healthy dish to test:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_FOOD_LIBRARY.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(item)}
                    className="flex flex-col text-left p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-14 object-cover rounded-lg mb-1.5"
                    />
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.calories} kcal · {item.proteinG}g protein
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Nutrition Breakdown & Portion Slider (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Calculated Nutrition
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1">{scanResult.foodName}</h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600">{currentCalories}</div>
                  <span className="text-[11px] text-slate-400 font-medium">kcal total</span>
                </div>
              </div>

              {/* Portion Slider */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    Portion Multiplier
                  </span>
                  <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {Math.round(portionMultiplier * 100)}% ({portionMultiplier.toFixed(2)}x)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={portionMultiplier}
                  onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Small (0.5x)</span>
                  <span>Standard (1.0x)</span>
                  <span>Large (2.0x)</span>
                </div>
              </div>

              {/* Macronutrient Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <p className="text-[11px] text-emerald-900 font-medium">Protein</p>
                  <p className="text-lg font-black text-emerald-700 mt-0.5">{currentProtein}g</p>
                  <p className="text-[10px] text-emerald-600">Satiety & Muscle preservation</p>
                </div>

                <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                  <p className="text-[11px] text-blue-900 font-medium">Carbohydrates</p>
                  <p className="text-lg font-black text-blue-700 mt-0.5">{currentCarbs}g</p>
                  <p className="text-[10px] text-blue-600">Glycemic Load: {scanResult.glycemicIndex}</p>
                </div>

                <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                  <p className="text-[11px] text-amber-900 font-medium">Fats</p>
                  <p className="text-lg font-black text-amber-700 mt-0.5">{currentFat}g</p>
                  <p className="text-[10px] text-amber-600">Essential lipids</p>
                </div>

                <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100">
                  <p className="text-[11px] text-teal-900 font-medium">Dietary Fiber</p>
                  <p className="text-lg font-black text-teal-700 mt-0.5">{currentFiber}g</p>
                  <p className="text-[10px] text-teal-600">Gut health & glucose buffer</p>
                </div>
              </div>

              {/* Meal Category Selector */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">Assign to Meal Slot:</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        mealType === type
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health & Diabetes Assessment */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Dietitian Cheryl's Note:</span>
                  <p className="text-[11px] text-emerald-900 mt-0.5 leading-snug">
                    This meal scores {scanResult.healthScore}/100. With {currentFiber}g fiber and {scanResult.glycemicIndex} GI, it complies with your pre-diabetes metabolic stabilization targets.
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogMeal}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Add to Food Diary (+50 FitPoints)</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Daily Food Diary Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Food Diary</h2>
            <p className="text-xs text-slate-500">
              Total Logged: <span className="font-bold text-slate-800">{totalCaloriesLogged} kcal</span> · Budget: {user.dailyCalorieBudget} kcal
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Streak Protected for Today 🔥
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => {
            const items = mealsByType[type];
            const typeCalories = items.reduce((acc, i) => acc + i.calories, 0);

            return (
              <div key={type} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-slate-400" />
                    {type}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {typeCalories} kcal
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No meals logged for {type} yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {item.portionSize} · P: {item.proteinG}g · C: {item.carbsG}g · F: {item.fatG}g · GI: {item.glycemicIndex}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-slate-900">{item.calories} kcal</span>
                          <button
                            onClick={() => onDeleteFoodItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
