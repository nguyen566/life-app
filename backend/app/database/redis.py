from redis.asyncio import Redis

from ..config import db_settings

_token_blacklist = Redis(
    host=db_settings.REDIS_HOST,
    port=db_settings.REDIS_PORT,
    db=0,
)

async def add_jti_to_blacklist(jti: str):
    async with _token_blacklist as redis:
        await redis.set(jti, "blacklisted")

async def is_jti_blacklisted(jti: str) -> bool:
    async with _token_blacklist as redis:
        return bool(await redis.exists(jti))