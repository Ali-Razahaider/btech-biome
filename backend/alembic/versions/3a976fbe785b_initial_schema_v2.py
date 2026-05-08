"""initial_schema_v2

Revision ID: 3a976fbe785b
Revises: 
Create Date: 2026-05-09 00:54:07.024403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3a976fbe785b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop existing tables with CASCADE to handle dependencies
    op.execute("DROP TABLE IF EXISTS profiles CASCADE")
    op.execute("DROP TABLE IF EXISTS challenge_participants CASCADE")
    op.execute("DROP TABLE IF EXISTS challenges CASCADE")
    op.execute("DROP TABLE IF EXISTS eco_actions CASCADE")
    op.execute("DROP TABLE IF EXISTS footprint_logs CASCADE")
    op.execute("DROP TABLE IF EXISTS ai_analyses CASCADE")
    op.execute("DROP TABLE IF EXISTS biomass_zones CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")

    # Create tables from scratch
    op.create_table('users',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('city', sa.String(length=120), nullable=True),
    sa.Column('habits', sa.JSON(), nullable=False),
    sa.Column('eco_points', sa.Integer(), nullable=False),
    sa.Column('streak', sa.Integer(), nullable=False),
    sa.Column('last_active_date', sa.Date(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table('challenges',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('title', sa.String(length=160), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=False),
    sa.Column('points_reward', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('challenge_participants',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.String(length=36), nullable=False),
    sa.Column('challenge_id', sa.String(length=36), nullable=False),
    sa.Column('joined_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['challenge_id'], ['challenges.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_challenge_participants_challenge_id'), 'challenge_participants', ['challenge_id'], unique=False)
    op.create_index(op.f('ix_challenge_participants_user_id'), 'challenge_participants', ['user_id'], unique=False)

    op.create_table('eco_actions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.String(length=36), nullable=False),
    sa.Column('category', sa.String(length=80), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('points', sa.Integer(), nullable=False),
    sa.Column('logged_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_eco_actions_user_id'), 'eco_actions', ['user_id'], unique=False)

    op.create_table('footprint_logs',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.String(length=36), nullable=False),
    sa.Column('total_co2e', sa.Float(), nullable=False),
    sa.Column('breakdown', sa.JSON(), nullable=False),
    sa.Column('logged_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_footprint_logs_user_id'), 'footprint_logs', ['user_id'], unique=False)

    op.create_table('ai_analyses',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('lat', sa.Float(), nullable=False),
    sa.Column('lng', sa.Float(), nullable=False),
    sa.Column('district', sa.String(length=120), nullable=True),
    sa.Column('feasibility_score', sa.Integer(), nullable=True),
    sa.Column('co2_saved_kg', sa.Float(), nullable=True),
    sa.Column('households_powered', sa.Integer(), nullable=True),
    sa.Column('aqi_improvement_percent', sa.Float(), nullable=True),
    sa.Column('tips', sa.JSON(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.CheckConstraint('feasibility_score >= 1 AND feasibility_score <= 10', name='feasibility_score_check')
    )

    op.create_table('biomass_zones',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('district', sa.String(length=120), nullable=False),
    sa.Column('crop_type', sa.String(length=80), nullable=False),
    sa.Column('residue_tonnes_annual', sa.Float(), nullable=False),
    sa.Column('geojson', sa.JSON(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_biomass_zones_district'), 'biomass_zones', ['district'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'footprint_logs', type_='foreignkey')
    op.create_foreign_key(op.f('footprint_logs_user_id_fkey'), 'footprint_logs', 'profiles', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_index(op.f('ix_footprint_logs_user_id'), table_name='footprint_logs')
    op.alter_column('footprint_logs', 'logged_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('footprint_logs', 'breakdown',
               existing_type=sa.JSON(),
               type_=postgresql.JSONB(astext_type=sa.Text()),
               existing_nullable=False)
    op.alter_column('footprint_logs', 'user_id',
               existing_type=sa.String(length=36),
               type_=sa.UUID(),
               nullable=True)
    op.alter_column('footprint_logs', 'id',
               existing_type=sa.String(length=36),
               type_=sa.BIGINT(),
               existing_nullable=False,
               existing_server_default=sa.Identity(always=False, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1))
    op.drop_constraint(None, 'eco_actions', type_='foreignkey')
    op.create_foreign_key(op.f('eco_actions_user_id_fkey'), 'eco_actions', 'profiles', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_index(op.f('ix_eco_actions_user_id'), table_name='eco_actions')
    op.alter_column('eco_actions', 'logged_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('eco_actions', 'points',
               existing_type=sa.INTEGER(),
               nullable=True,
               existing_server_default=sa.text('10'))
    op.alter_column('eco_actions', 'description',
               existing_type=sa.String(length=255),
               type_=sa.TEXT(),
               nullable=True)
    op.alter_column('eco_actions', 'category',
               existing_type=sa.String(length=80),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('eco_actions', 'user_id',
               existing_type=sa.String(length=36),
               type_=sa.UUID(),
               nullable=True)
    op.alter_column('eco_actions', 'id',
               existing_type=sa.String(length=36),
               type_=sa.BIGINT(),
               existing_nullable=False,
               existing_server_default=sa.Identity(always=False, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1))
    op.alter_column('challenges', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=True,
               existing_server_default=sa.text('true'))
    op.alter_column('challenges', 'end_date',
               existing_type=sa.Date(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=True)
    op.alter_column('challenges', 'start_date',
               existing_type=sa.Date(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=True)
    op.alter_column('challenges', 'points_reward',
               existing_type=sa.INTEGER(),
               nullable=True,
               existing_server_default=sa.text('100'))
    op.alter_column('challenges', 'description',
               existing_type=sa.String(length=500),
               type_=sa.TEXT(),
               nullable=True)
    op.alter_column('challenges', 'title',
               existing_type=sa.String(length=160),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('challenges', 'id',
               existing_type=sa.String(length=36),
               type_=sa.BIGINT(),
               existing_nullable=False,
               existing_server_default=sa.Identity(always=False, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1))
    op.drop_column('challenges', 'created_at')
    op.drop_constraint(None, 'challenge_participants', type_='foreignkey')
    op.create_foreign_key(op.f('challenge_participants_user_id_fkey'), 'challenge_participants', 'profiles', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_index(op.f('ix_challenge_participants_user_id'), table_name='challenge_participants')
    op.drop_index(op.f('ix_challenge_participants_challenge_id'), table_name='challenge_participants')
    op.create_unique_constraint(op.f('challenge_participants_user_id_challenge_id_key'), 'challenge_participants', ['user_id', 'challenge_id'], postgresql_nulls_not_distinct=False)
    op.alter_column('challenge_participants', 'joined_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('challenge_participants', 'challenge_id',
               existing_type=sa.String(length=36),
               type_=sa.BIGINT(),
               nullable=True)
    op.alter_column('challenge_participants', 'user_id',
               existing_type=sa.String(length=36),
               type_=sa.UUID(),
               nullable=True)
    op.alter_column('challenge_participants', 'id',
               existing_type=sa.String(length=36),
               type_=sa.BIGINT(),
               existing_nullable=False,
               existing_server_default=sa.Identity(always=False, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1))
    op.alter_column('ai_analyses', 'created_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('ai_analyses', 'tips',
               existing_type=sa.JSON(),
               type_=postgresql.JSONB(astext_type=sa.Text()),
               nullable=True)
    op.alter_column('ai_analyses', 'district',
               existing_type=sa.String(length=120),
               type_=sa.TEXT(),
               existing_nullable=True)
    op.alter_column('ai_analyses', 'id',
               existing_type=sa.Integer(),
               type_=sa.BIGINT(),
               existing_nullable=False,
               existing_server_default=sa.Identity(always=False, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1))
    op.create_table('profiles',
    sa.Column('id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('email', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('city', sa.TEXT(), server_default=sa.text("'Lahore'::text"), autoincrement=False, nullable=True),
    sa.Column('habits', postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), autoincrement=False, nullable=True),
    sa.Column('eco_points', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
    sa.Column('streak', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
    sa.Column('last_active_date', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('first_name', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('last_name', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('gender', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('country', sa.TEXT(), server_default=sa.text("'Pakistan'::text"), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['id'], ['auth.users.id'], name=op.f('profiles_id_fkey'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('profiles_pkey'))
    )
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_biomass_zones_district'), table_name='biomass_zones')
    op.drop_table('biomass_zones')
    # ### end Alembic commands ###
