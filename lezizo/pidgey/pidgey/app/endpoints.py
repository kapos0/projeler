from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.schemas import MessageOut, FindByIngredientsOut, RecipeDetailOut, ComplexSearchOut, RandomOut
from app.services import RecipeService
from database import get_db
from app.models import Recipe, CuisineType


router = APIRouter()


@router.get("/complexSearch", response_model=ComplexSearchOut)
def complex_search(
        db: Session = Depends(get_db),
        number: int = Query(..., title="Number", description="Number of recipes to list."),
        cuisine: CuisineType = Query(..., title="Cuisine", description="Which cuisine the listed recipes belong to.")
):

    return RecipeService(db).complex_search(cuisine=cuisine, number=number)

@router.get("/search", response_model=list[FindByIngredientsOut])
def search_by_title(
    db: Session = Depends(get_db),
    number: int = Query(..., title="Number", description="Number of recipes to list."),
    title: str = Query(..., title="Title", description="Title of the recipe to search for.")
):

    recipes = RecipeService(db).search_by_title(title=title, number=number)
    return recipes


@router.get("/findByIngredients", response_model=list[FindByIngredientsOut])
def find_by_ingredients(
        db: Session = Depends(get_db),
        number: int = Query(..., title="Number", description="Number of recipes to list."),
        ingredients: str = Query(..., title="Ingredients", description="Which ingredients will be in the listed recipes.")  # noqa
):

    return RecipeService(db).find_by_ingredients(ingredients=ingredients, number=number)


@router.get("/random", response_model=RandomOut)
def get_random_recipe(
        db: Session = Depends(get_db),
        number: int = Query(..., title="Number", description="Number of recipes to list."),
        tags: str = Query(None, title="Tags", description="Specify which tags the listed recipes will contain.")
):

    return RecipeService(db).get_random_recipes(tags=tags, number=number)


@router.get("/{recipe_id}/information", response_model=RecipeDetailOut)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    return RecipeService(db).get_recipe_by_id(recipe_id=recipe_id)


@router.get("/generate_fake_data", response_model=MessageOut)
def generate_fake_data(db: Session = Depends(get_db)):

    recipe_1_ingredients = [{"id": 1, "original": "soğan"}, {"id": 2, "original": "biber"}, {"id": 3, "original": "domates"}, {"id": 4, "original": "yumurta"}]
    recipe_1 = Recipe(
        title="Menemen",
        image="https://cdn.yemek.com/mnresize/1250/833/uploads/2023/10/soganli-menemen-yemekcom.jpg",
        summary="karıştırılmış yumurta, domates, biber",
        instructions='önce soğan sonra biber <iframe width="560" height="315" src="https://www.youtube.com/embed/GaduRIkOYzA?si=lwxbs2RtOVaMl4qw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        ingredients=recipe_1_ingredients,
        is_popular=True,
        cuisine="turkey",
        tags="vegetarian"

    )

    recipe_2_ingredients = [{"id": 1, "original": "sucuk"}, {"id": 2, "original": "yumurta"},{"id": 3, "original": "sıvı yağ"}]
    recipe_2 = Recipe(
        title="Sucuklu yumurta",
        image="https://yemek.com/_next/image/?url=https%3A%2F%2Fcdn.yemek.com%2Fmnresize%2F1250%2F833%2Fuploads%2F2021%2F04%2Fsucuklu-yumurta-tavasi.jpg&w=1920&q=75",
        summary="harika hızlı bir yemek",
        instructions='yumurtayı tavada kızart <iframe width="560" height="315" src="https://www.youtube.com/embed/Fh97__MQNc0?si=qCkUmJmwdLxMGGaX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        ingredients=recipe_2_ingredients,
        is_popular=False,
        cuisine="world",
        tags="vegetarian"
    )

    db.add(recipe_1)
    db.add(recipe_2)
    db.commit()

    return {"message": "Test Data Generated!"}
