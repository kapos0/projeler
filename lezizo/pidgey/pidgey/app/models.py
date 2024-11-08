from datetime import datetime
from enum import Enum as EnumBase

from pytz import timezone
from sqlalchemy import Column, Enum, Integer, String, Text, JSON, Boolean
from sqlalchemy import DateTime as OldDateTime
from sqlalchemy.types import TypeDecorator

from database import Base
from settings import settings



class CuisineType(str, EnumBase):
    world = "world"
    turkey = "turkey"
    usa = "usa"



class DateTime(TypeDecorator):  
    impl = OldDateTime
    cache_ok = True

    def process_bind_param(self, value, engine):
        return datetime.now(timezone(settings.API_TIMEZONE))

    def process_result_value(self, value, engine):
        return value


class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    modified_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)



class Recipe(BaseModel):
    __tablename__ = "recipes"  

    title = Column(String(255), nullable=False)
    image = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    ingredients = Column(JSON)
    cuisine = Column(Enum(CuisineType), nullable=False, default=CuisineType.world)
    is_popular = Column(Boolean, nullable=False, default=False, server_default="0")
    tags = Column(String(255), nullable=True)



