import html as html_module
import logging
import httpx

from app.fetchers.base import AbstractFetcher, NormalizedJob
from app.config import get_settings

logger = logging.getLogger(__name__)

_BASE = "https://api.ashbyhq.com/posting-api/job-board/{board_id}"


def _clean_description(raw: str) -> str:
    return html_module.unescape(raw or "").strip()


class AshbyFetcher(AbstractFetcher):
    async def fetch(self, board_id: str) -> list[NormalizedJob]:
        url = _BASE.format(board_id=board_id)
        timeout = get_settings().fetch_timeout_seconds
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.get(url)
            if resp.status_code == 404:
                logger.warning("Ashby board not found: %s", board_id)
                return []
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            logger.warning("Ashby fetch error for %s: %s", board_id, e)
            return []

        jobs: list[NormalizedJob] = []
        for job in data.get("jobs", []):
            location = job.get("location", "") or "Remote"
            remote = job.get("isRemote", False) or "remote" in location.lower()
            dept = job.get("department", "")
            description = _clean_description(job.get("descriptionHtml", "") or job.get("description", ""))[:5000]
            jobs.append(
                NormalizedJob(
                    external_id=job.get("id", ""),
                    title=job.get("title", ""),
                    location=location,
                    remote=remote,
                    department=dept,
                    url=job.get("jobUrl", ""),
                    description=description,
                    raw_json=job,
                )
            )
        return jobs
