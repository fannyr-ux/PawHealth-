export const formatRecommendation = (
  text: string
) => {
  const sections = {
    routine: [] as string[],
    diet: [] as string[],
    vaccines: [] as string[],
  }

  const lines = text.split('\n')

  let currentSection = ''

  lines.forEach((line) => {
    const clean =
      line.trim()

    if (
      clean
        .toLowerCase()
        .includes('rutina')
    ) {
      currentSection = 'routine'
      return
    }

    if (
      clean
        .toLowerCase()
        .includes('dieta')
    ) {
      currentSection = 'diet'
      return
    }

    if (
      clean
        .toLowerCase()
        .includes('vacunas pendientes')
    ) {
      currentSection = 'vaccines'
      return
    }

    if (
      clean.startsWith('-') &&
      currentSection
    ) {
      sections[
        currentSection as keyof typeof sections
      ].push(
        clean.replace('-', '').trim()
      )
    }
  })

  return sections
}