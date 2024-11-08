from fastapi import HTTPException, status

from app.models import Recipe


class RecipeService:
    def __init__(self, db):
        self.db = db

    def find_by_ingredients(self, ingredients: str, number: int = 9):
        ingredients = [ingredient.strip() for ingredient in ingredients.split(",")]
        filter_array = [Recipe.ingredients.like("%{}%".format(ingredient)) for ingredient in ingredients]
        recipes = self.db.query(Recipe).filter(*filter_array).limit(number)
        return recipes

    def search_by_title(self, title: str, number: int = 9):
        recipes = self.db.query(Recipe).filter(Recipe.title.ilike(f'%{title}%')).limit(number).all()
        
        return recipes

    def complex_search(self, cuisine: str, number: int = 99):

        recipes, results = self.db.query(Recipe).filter(Recipe.cuisine == cuisine).limit(number), []

        for i in recipes:
            results.append({"id": i.id, "image": i.image, "title": i.title, "imageType": "jpg"})

        return {"results": results}

    def get_recipe_by_id(self, recipe_id: int):

        recipe = self.db.query(Recipe).filter(Recipe.id == recipe_id).first()

        if not recipe:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        recipe_data = {
            "id": recipe_id,
            "title": recipe.title,
            "image": recipe.image,
            "summary": recipe.summary,
            "instructions": recipe.instructions,
            "extendedIngredients": recipe.ingredients
        }

        return recipe_data

    def get_random_recipes(self, tags: str = None, number: int = 99):
        filter_array = []

        if tags:
            filter_array.append(Recipe.tags.like(tags))
        else:
            filter_array.append(Recipe.is_popular == True)  # noqa

        recipes, results = self.db.query(Recipe).filter(*filter_array).limit(number), []

        for i in recipes:
            results.append({"id": i.id, "image": i.image, "title": i.title, "imageType": "jpg"})

        return {"recipes": results}
