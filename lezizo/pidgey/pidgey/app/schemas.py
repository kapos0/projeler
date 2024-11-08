from datetime import datetime

from pydantic import BaseModel


class BaseOutModel(BaseModel):
    id: int
    created_at: datetime
    modified_at: datetime


class MessageOut(BaseModel):
    message: str


class MessageOutWithID(MessageOut):
    id: int


class FindByIngredientsOut(BaseOutModel):
    image: str
    title: str


class RandomItemOut(BaseModel):
    id: int
    title: str
    image: str
    imageType: str = "jpg"


class RandomOut(BaseModel):
    recipes: list[RandomItemOut]


class ComplexSearchItemOut(BaseModel):
    id: int
    title: str
    image: str
    imageType: str = "jpg"


class ComplexSearchOut(BaseModel):
    results: list[ComplexSearchItemOut]


class ExtendedIngredientsOut(BaseModel):
    id: int
    original: str


class RecipeDetailOut(BaseModel):
    id: int
    title: str
    image: str
    summary: str
    instructions: str
    extendedIngredients: list[ExtendedIngredientsOut]
