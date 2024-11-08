"""add new fields

Revision ID: a7a7ad495a95
Revises: 867f41206258
Create Date: 2024-03-22 03:15:04.935957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7a7ad495a95'
down_revision: Union[str, None] = '867f41206258'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('recipes', sa.Column('is_popular', sa.Boolean(), server_default='0', nullable=False))
    op.add_column('recipes', sa.Column('tags', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('recipes', 'tags')
    op.drop_column('recipes', 'is_popular')
    # ### end Alembic commands ###