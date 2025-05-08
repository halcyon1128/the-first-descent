import { h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { PlayerContext } from '../contexts/PlayerContext'
import units from '../data/units.json'
import defaultNames from '../data/defaultNames.json'

const MAX_HEROES = 6

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
    // Enemy count is exactly one more than the number of heroes.
    const enemyCount = tempHeroes.length + 1
    const availableEnemies = units.filter(unit => unit.team === 'enemy')

    // Separate boss from non-boss enemies.
    const bosses = availableEnemies.filter(unit => unit.boss)
    const nonBossEnemies = availableEnemies.filter(unit => !unit.boss)

    // Randomly pick one boss unit.
    const selectedBoss = bosses[Math.floor(Math.random() * bosses.length)]

    // Determine if the selected boss is Ardehel_of_the_Pestilence.
    const isArdehelBoss =
      selectedBoss && selectedBoss.name === 'Ardehel_of_the_Pestilence'

    // Randomly select non-boss enemies.
    let selectedEnemies = []
    while (selectedEnemies.length < enemyCount - 1) {
      const randomNonBoss =
        nonBossEnemies[Math.floor(Math.random() * nonBossEnemies.length)]
      selectedEnemies.push(randomNonBoss)
    }

    // Add the boss to the enemies list.
    selectedEnemies = [...selectedEnemies, selectedBoss]
    // Shuffle the final list.
    selectedEnemies = selectedEnemies.sort(() => Math.random() - 0.5)
    // Shuffle names and match the count.
    const shuffledNames = [...defaultNames].sort(() => Math.random() - 0.5)
    const adjustedNames = shuffledNames.slice(0, selectedEnemies.length)

    return selectedEnemies.map((enemy, index) => {
      // For enemy units that are not the boss we assign a default id and name.
      const enemyName = adjustedNames[index] || `Enemy${index + 1}`
      let newEnemy = {
        ...enemy,
        id:
          enemy.boss && enemy.name === 'Ardehel_of_the_Pestilence'
            ? enemy.name
            : enemyName,
        name:
          enemy.boss && enemy.name === 'Ardehel_of_the_Pestilence'
            ? enemy.name
            : enemyName
      }

      // Gate checker: if our boss is Ardehel_of_the_Pestilence, tag all non-boss enemies.
      if (isArdehelBoss && !enemy.boss) {
        newEnemy.isKilled = false
      }
      return newEnemy
    })
  }

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
    <div className='p-8'>
      <h1>Select Your Heroes</h1>
      <div className='flex flex-wrap justify-center mb-8'>
        {availableHeroes.map(hero => (
          <div
            key={hero.type}
            onClick={() => handleSelectHero(hero)}
            className='border p-4 m-2 cursor-pointer'
            // Optionally dim the hero option if maximum reached.
            style={{ opacity: tempHeroes.length >= MAX_HEROES ? 0.5 : 1 }}
          >
            <p>{hero.type}</p>
          </div>
        ))}
      </div>
      <h2>Your Selected Heroes</h2>
      <div className='flex flex-wrap justify-center mb-8'>
        {tempHeroes.map(hero => (
          <div
            key={hero.id}
            onClick={() => handleEditHero(hero)}
            className='border p-4 m-2 cursor-pointer'
          >
            <p>{hero.type}</p>
            <p>Name: {hero.name}</p>
            <p>Row: {hero.row}</p>
          </div>
        ))}
      </div>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              minWidth: '300px'
            }}
          >
            <h3>Configure Hero</h3>
            <p>Hero Type: {selectedHeroType && selectedHeroType.type}</p>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Name:
                <input
                  type='text'
                  value={heroName}
                  onInput={e => setHeroName(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Row:
                <select
                  value={heroRow}
                  onChange={e => setHeroRow(e.target.value)}
                >
                  <option value='front'>Front</option>
                  <option value='back'>Back</option>
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleSaveHero}>Save Hero</button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedHeroType(null)
                  setHeroName('')
                  setHeroRow('front')
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleEnterDungeon}
        className='block mx-auto p-4 text-lg'
      >
        Enter Dungeon!
      </button>
    </div>
  )
}

export default NewGame
