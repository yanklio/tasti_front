interface BackendRecipeBrief {
  id: number;
  title: string;
  description: string;
  image_download_url?: string;
  owner: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
}

class RecipeBrief {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  owner: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    difficulty: 'easy' | 'medium' | 'hard',
    duration: string,
    imageUrl?: string,
    imageBucketKey?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.difficulty = difficulty;
    this.duration = duration;
    this.imageUrl = imageUrl;
  }

  static fromBackend(backendRecipe: BackendRecipeBrief): RecipeBrief {
    return new RecipeBrief(
      backendRecipe.id,
      backendRecipe.title,
      backendRecipe.description,
      backendRecipe.owner,
      backendRecipe.difficulty,
      backendRecipe.duration,
      backendRecipe.image_download_url,
    );
  }

  toBackend(): BackendRecipeBrief {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      owner: this.owner,
      difficulty: this.difficulty,
      duration: this.duration,
    };
  }
}

interface BackendRecipe extends BackendRecipeBrief {
  ingredients?: string[];
}

class Recipe extends RecipeBrief {
  ingredients: string[];

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    difficulty: 'easy' | 'medium' | 'hard',
    duration: string,
    imageUrl?: string,
    ingredients?: string[],
  ) {
    super(id, title, description, owner, difficulty, duration, imageUrl);
    this.ingredients = ingredients || [];
  }

  static override fromBackend(backendRecipe: BackendRecipe): Recipe {
    return new Recipe(
      backendRecipe.id,
      backendRecipe.title,
      backendRecipe.description,
      backendRecipe.owner,
      backendRecipe.difficulty,
      backendRecipe.duration,
      backendRecipe.image_download_url,
      backendRecipe.ingredients,
    );
  }

  override toBackend(): BackendRecipe {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      owner: this.owner,
      difficulty: this.difficulty,
      duration: this.duration,
      ingredients: this.ingredients,
    };
  }
}

export type { BackendRecipe, BackendRecipeBrief };
export { Recipe, RecipeBrief };
