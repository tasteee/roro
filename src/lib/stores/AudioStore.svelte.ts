import sounds from '$lib/data/sounds'

class AudioStore {
  context = $state(null)
  analyser = $state(null)
  backgroundAudio = $state(null)
  playingClips = new Set()

  volume = $state(20)
  isSoundtrackMuted = $state(false)

  frequencyData = $state(new Uint8Array(1024))
  lowFrequency = 100
  highFrequency = 2500
  vizBars = $state(null)
  vizBarColors = []
  sounds = sounds

  interfaceSounds = $state<any>({
    buttonHover: null,
    buttonClick: null,
    itemAdd: null,
    itemDelete: null,
    itemRotate: null,
    itemMove: null,
    itemScale: null,
    unavailable: null,
    itemFavorite: null
  })

  setVolume = (volume: number) => {
    this.volume = volume
  }

  toggleMute = () => {
    this.isSoundtrackMuted = !this.isSoundtrackMuted
  }

  playClip = (clipId: string) => {
    const config = this.sounds[clipId]
    if (!this.interfaceSounds[clipId]) return
    const isInPlayingList = this.playingClips.has(clipId)
    const audio = this.interfaceSounds[clipId] as any
    // console.log(clipId, isInPlayingList, audio)
    if (isInPlayingList) audio.stop()
    if (!isInPlayingList) this.playingClips.add(clipId)
    audio.play()
  }

  stopClip = (clipId: string) => {
    if (!this.interfaceSounds[clipId]) return
    this.interfaceSounds[clipId].stop()
    this.playingClips.delete(clipId)
  }

  playClipHandler = (clipId: string) => {
    return () => this.playClip(clipId)
  }

  stopClipHandler = (clipId: string) => {
    return () => this.stopClip(clipId)
  }
}

const audioStore = new AudioStore()
globalThis.audioStore = audioStore
export default audioStore
