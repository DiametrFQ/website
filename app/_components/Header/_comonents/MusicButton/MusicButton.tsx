'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

const MUSIC_VOLLUME_CHENGE = 0.03
const MUSIC_VOLLUME_MAX = 0.3

const musicTracks = [
  "breezehome.mp3",
  "getting better.mp3",
  "soul gem.mp3",
].map((name) => `/music/${name}`)

export function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let fadeInterval: NodeJS.Timeout | null = null

    if (fadeOut && audioRef.current) {
      fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0) {
          audioRef.current.volume = Math.max(audioRef.current.volume - MUSIC_VOLLUME_CHENGE, 0)
        } else {
          clearInterval(fadeInterval!)
          setIsPlaying(false)
          setFadeOut(false)
          audioRef.current!.pause()
        }
      }, 100)
    }

    return () => {
      if (fadeInterval) clearInterval(fadeInterval)
    }
  }, [fadeOut])

  useEffect(() => {
    let fadeInInterval: NodeJS.Timeout | null = null

    if (fadeIn && audioRef.current) {
      fadeInInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 1) {
          audioRef.current.volume = Math.min(audioRef.current.volume + MUSIC_VOLLUME_CHENGE, MUSIC_VOLLUME_MAX)
        } else {
          clearInterval(fadeInInterval!)
        }
      }, 100)
    }

    return () => {
      if (fadeInInterval) clearInterval(fadeInInterval)
    }
  }, [fadeIn])

  const playNextTrack = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % musicTracks.length
    setCurrentTrackIndex(nextTrackIndex)

    if (audioRef.current) {
      audioRef.current.src = musicTracks[nextTrackIndex]
      audioRef.current.play()
      setIsPlaying(true)
      setFadeIn(true)
      setFadeOut(false)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        setFadeIn(false)
        setFadeOut(true)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        setFadeIn(true)
        setFadeOut(false)
      }
    }
  }

  const onTrackEnded = () => {
    playNextTrack()
  }

  return (
    <div>
      <Button className="dark:bg-white dark:border-white dark:invert rounded-full" onClick={toggleMusic} variant="outline" size="icon">
        <Image src={"/music.png"} width={20} height={20} alt={"Music"} />
      </Button>

      <audio
        ref={audioRef}
        src={musicTracks[currentTrackIndex]}
        preload="auto"
        onEnded={onTrackEnded}
      />
    </div>
  )
}