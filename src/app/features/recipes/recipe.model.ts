class RecipeBrief {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  owner: string;

  constructor(id: number, name: string, description: string, imageUrl: string, owner: string) {
    this.id = id;
    this.title = name;
    this.description = description;
    this.imageUrl = imageUrl || '';
    this.owner = owner;
  }
}

class Recipe extends RecipeBrief {
  ingredients?: string[];

  constructor(
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    owner: string,
    ingredients?: string[],
  ) {
    super(id, name, description, imageUrl, owner);
    this.ingredients = ingredients || [];
  }
}

export { Recipe, RecipeBrief };
