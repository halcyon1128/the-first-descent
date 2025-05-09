import { h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { PlayerContext } from '../contexts/PlayerContext'
import units from '../data/units.json'
import defaultNames from '../data/defaultNames.json'

const MAX_HEROES = 5

const NewGame = () => {
  const { setHeroRoster, setEnemyRoster } = useContext(PlayerContext)
  const [tempHeroes, setTempHeroes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedHeroType, setSelectedHeroType] = useState(null)
  const [heroName, setHeroName] = useState('')
  const [heroRow, setHeroRow] = useState('front')

  // HERO SELECTION
  const availableHeroes = units.filter(unit => unit.team === 'hero')
  const handleSelectHero = hero => {
    if (tempHeroes.length >= MAX_HEROES) {
      alert(`Maximum number of heroes (${MAX_HEROES}) reached.`)
      return
    }
    setSelectedHeroType(hero)
    setHeroName(hero.type)
    setHeroRow('front')
    setShowModal(true)
  }

  const handleSaveHero = () => {
    if (!selectedHeroType || !heroName) {
      alert('Please enter a name.')
      return
    }

    // Check for duplicate hero names.
    const duplicate = tempHeroes.some(
      h =>
        h.name.trim().toLowerCase() === heroName.trim().toLowerCase() &&
        (selectedHeroType.id ? h.id !== selectedHeroType.id : true)
    )
    if (duplicate) {
      alert('Hero names must be unique. Please choose a different name.')
      return
    }

    // Check if we're editing an existing hero.
    const isEditing = tempHeroes.some(h => h.id === selectedHeroType.id)
    if (isEditing) {
      setTempHeroes(oldHeroes =>
        oldHeroes.map(h =>
          h.id === selectedHeroType.id
            ? {
                ...selectedHeroType,
                id: heroName,
                name: heroName,
                row: heroRow
              }
            : h
        )
      )
    } else {
      // Add new hero.
      const newHero = {
        ...selectedHeroType,
        id: heroName,
        name: heroName,
        row: heroRow
      }
      setTempHeroes(oldHeroes => [...oldHeroes, newHero])
    }
    // Reset modal state after saving.
    setShowModal(false)
    setSelectedHeroType(null)
    setHeroName('')
    setHeroRow('front')
  }

  const handleEditHero = hero => {
    setSelectedHeroType(hero)
    setHeroName(hero.name || hero.type)
    setHeroRow(hero.row || 'front')
    setShowModal(true)
  }

  // ENEMY SELECTION
  const generateEnemies = () => {
    // 1. Get enemy templates and validate
    const enemyTemplates = units.filter(unit => unit.team === 'enemy');
    if (enemyTemplates.length === 0) {
      console.error("No enemy templates found in units.json. Cannot generate enemies.");
      return [];
    }
  
    // At least one boss is required.
    const bossTemplates = enemyTemplates.filter(unit => unit.boss === true);
    if (bossTemplates.length === 0) {
      console.error("No boss templates found in units.json. Cannot satisfy 'at least one boss' requirement.");
      return [];
    }
  
    // 2. Compute rating requirement.
    const totalHeroRating = tempHeroes.reduce((sum, hero) => sum + hero.rating, 0);
    console.log('totalHeroRating ---> ', totalHeroRating )
    const minEnemyRating = totalHeroRating + 5;
  
    // 3. Start with one boss enemy.
    const selectedEnemies = [];
    let currentRating = 0;
  
    const chosenBoss = { ...bossTemplates[Math.floor(Math.random() * bossTemplates.length)] };
    delete chosenBoss.name; // Remove any existing name property.
    selectedEnemies.push(chosenBoss);
    currentRating += chosenBoss.rating;
  
    // 4. Prepare a shuffled pool of enemy copies without the .name property.
// Create a pool of non-boss enemy copies
const pool = enemyTemplates
  .filter(enemy => !enemy.boss)  // Only include non-boss units
  .map(enemy => {
    const copy = { ...enemy };
    delete copy.name;
    return copy;
  })
  .sort(() => Math.random() - 0.5);

  
    // Add enemies until reaching the required collective rating.
    while (currentRating < minEnemyRating && pool.length > 0) {
      const enemy = pool.pop();
      selectedEnemies.push(enemy);
      currentRating += enemy.rating;
    }
  
    if (currentRating < minEnemyRating) {
      console.error(`Failed to meet enemy rating threshold: required ${minEnemyRating}, reached ${currentRating}.`);
      return [];
    }
  
    // 5. Assign unique IDs from defaultNames.
    const usedIds = new Set();
    selectedEnemies.forEach((enemy, i) => {
      // Use a name from defaultNames if available; otherwise, use a fallback scheme.
      let id = defaultNames[i] || `${enemy.type}_${i + 1}`;
      // Ensure no duplicate IDs.
      while (usedIds.has(id)) {
        id = `${enemy.type}_${i + 1}_${Math.floor(Math.random() * 1000)}`;
      }
      usedIds.add(id);
      enemy.id = id;
    });
    console.log('totalEnemyRating ---> ', currentRating)
    return selectedEnemies;
  };
  

  // INITIATE NEW GAME
  const handleEnterDungeon = () => {
    if (tempHeroes.length === 0) {
      alert('Please select at least one hero.')
      return
    }

    const heroNames = tempHeroes.map(hero => hero.name.trim().toLowerCase())
    if (new Set(heroNames).size !== heroNames.length) {
      alert(
        'Hero names must be unique. Please ensure each hero has a distinct name.'
      )
      return
    }

    setHeroRoster(tempHeroes)
    const enemies = generateEnemies()
    setEnemyRoster(enemies)

    console.log('Heroes:', tempHeroes)
    console.log('Enemies:', enemies)
  }

  return (
    <div className='min-h-screen bg-gray-800 text-gray-200 p-4 md:p-8 font-serif'>
      <h1 className='text-3xl md:text-3xl font-bold text-center text-amber-400 mb-8 tracking-wider'>
The First Descent v.1.5      </h1>
      
      <div className='mb-10'>
        <h2 className='text-sm text-amber-300 mb-4 border-b-2 border-gray-700 pb-2'>Choose Your Heroes ({tempHeroes.length}/{MAX_HEROES})</h2>
        <div className='grid grid-cols-6  gap-2'>
          {availableHeroes.map(hero => (
            <div 
              key={hero.type}
              onClick={() => handleSelectHero(hero)}
              className={` bg-gray-700 border-2 border-gray-600 py-4 px-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-600 hover:border-amber-500 transition-all duration-200 text-center ${tempHeroes.length >= MAX_HEROES ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <p className='text-xs text-center font-semibold text-amber-200'>{hero.type}</p>
              {/* Optional: Add a small icon or image here */}
            </div>
          ))}
        </div>
      </div>

      {tempHeroes.length > 0 && (
        <div className='mb-10'>
          <h2 className='text-2xl text-amber-300 mb-4 border-b-2 border-gray-700 pb-2'>Your Chosen Adventurers</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {tempHeroes.map(hero => (
              <div
                key={hero.id}
                onClick={() => handleEditHero(hero)}
                className='bg-gray-700 border-2 border-amber-600 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-600'
              >
                <p className='text-xl font-bold text-amber-100'>{hero.name}</p>
                <p className='text-sm text-gray-400'>Type: {hero.type}</p>
                <p className='text-sm text-gray-400'>Row: {hero.row.charAt(0).toUpperCase() + hero.row.slice(1)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4'>
          <div className='bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl border-2 border-amber-500 w-full max-w-md text-gray-200'>
            <h3 className='text-2xl font-bold text-amber-400 mb-6 text-center'>Configure Your Hero</h3>
            <p className='text-lg mb-2 text-amber-200'>
              Hero Type: <span className='font-semibold'>{selectedHeroType && selectedHeroType.type}</span>
            </p>
            <div className='mb-4'>
              <label htmlFor='heroName' className='block text-sm font-medium text-gray-300 mb-1'>
                Name your hero:
              </label>
              <input
                id='heroName'
                type='text'
                value={heroName}
                onInput={e => setHeroName(e.target.value)}
                className='w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500'
                placeholder='e.g., Sir Reginald'
              />
            </div>
            <div className='mb-6'>
              <label htmlFor='heroRow' className='block text-sm font-medium text-gray-300 mb-1'>
                Preferred Row:
              </label>
              <select
                id='heroRow'
                value={heroRow}
                onChange={e => setHeroRow(e.target.value)}
                className='w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500'
              >
                <option value='front'>Front Line</option>
                <option value='back'>Back Line</option>
              </select>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-3'>
              <button 
                onClick={handleSaveHero}
                className='w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors duration-200'
              >
                Save Hero
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedHeroType(null)
                  setHeroName('')
                  setHeroRow('front')
                }}
                className='w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-6 rounded-md shadow-md transition-colors duration-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {tempHeroes.length > 0 && (
         <div className='text-center mt-12'>
            <button
              onClick={handleEnterDungeon}
              disabled={tempHeroes.length === 0}
              className={`bg-red-700 hover:bg-red-800 text-white font-bold text-xl py-3 px-8 rounded-lg shadow-xl transition-all duration-200 tracking-wider
                          ${tempHeroes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:scale-105'}`}
            >
              Enter the Dungeon!
            </button>
         </div>
      )}
    </div>
  )
}

export default NewGame
