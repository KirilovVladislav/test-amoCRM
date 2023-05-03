import { useEffect, useRef, useState } from "react"
import styles from './App.module.css'

const formatTime = (time) => {
  return time.toString().padStart(2, '0')
}

const timerValues = [5, 10, 15]

function App() {
  const time = useRef(0)
  const timerId = useRef(null)
  const [activeTimer, setActiveTimer] = useState(null)
  const [clockFace, setClockFace] = useState({ hh: '00', mm: '00', ss: '00' })

  const updateClockFace = (seconds) => {
    setClockFace({
      hh: formatTime(Math.trunc(seconds / (60 * 60))),
      mm: formatTime(Math.trunc(seconds / 60) % 60),
      ss: formatTime(seconds % 60),
    })
  }

  useEffect(() => {
    if (!activeTimer) return

    time.current = -(activeTimer * 60)

    timerStop()
    timerStart(activeTimer)
    updateClockFace(Math.abs(time.current))
  }, [activeTimer])

  const timerStart = () => {
    if (timerId.current) return

    timerId.current = setInterval(() => {
      if (activeTimer && time.current === 0) timerStop()

      time.current = time.current + 1
      updateClockFace(Math.abs(time.current))
    }, 1000)
  }

  const timerStop = () => {
    if (!timerId.current) return

    clearInterval(timerId.current)
    timerId.current = null
  }

  const resetTime = () => {
    timerStop()
    time.current = null
    setActiveTimer(null)
    updateClockFace(0)
  }

  return (
    <div className={styles.timer}>
      <div className={styles.btnGroup}>
        {timerValues.map((numberOfMinutes) => (
          <button
            key={numberOfMinutes}
            onClick={() => setActiveTimer(numberOfMinutes)}
            className={`${numberOfMinutes == activeTimer && styles.btnActive}`}
          >{numberOfMinutes} min</button>
        ))}
      </div>
      <div>
        <span>{`
          ${clockFace.hh}:
          ${clockFace.mm}:
          ${clockFace.ss}
        `}</span>
      </div>
      <div className={styles.btnGroup}>
        <button onClick={timerStart}>start</button>
        <button onClick={timerStop}>stop</button>
        <button onClick={resetTime}>reset</button>
      </div>
    </div>
  )
}

export default App
