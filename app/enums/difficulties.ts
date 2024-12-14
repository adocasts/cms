enum Difficulties {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
}

export const DifficultyDesc: Record<Difficulties, string> = {
  [Difficulties.BEGINNER]: 'Beginner',
  [Difficulties.INTERMEDIATE]: 'Intermediate',
  [Difficulties.ADVANCED]: 'Advanced',
}

export default Difficulties
