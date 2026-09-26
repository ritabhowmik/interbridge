import uuid
from sqlalchemy import Column, String, Text, JSON
from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(String, primary_key=True, default=gen_uuid)
    province = Column(String, nullable=False)              # "ON" | "QC" | "BC" | "AB"
    sector = Column(String, nullable=False)                  # e.g. "alcohol_production"
    requirement_type = Column(String, nullable=False)          # "licensing" | "certification" | "inspection" | "labeling" | "tax" | "other"
    title = Column(String, nullable=False)
    plain_language_summary = Column(Text, nullable=False)
    raw_requirement_text = Column(Text, nullable=False)
    authority = Column(String, nullable=False)
    source_url = Column(String, nullable=False)
    severity = Column(String, nullable=False)                    # "blocker" | "conditional" | "informational"
    last_verified = Column(String, nullable=False)                 # ISO date


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=gen_uuid)
    business_description = Column(Text, nullable=False)
    origin_province = Column(String, nullable=False)
    target_province = Column(String, nullable=False)
    sector_classified = Column(String, nullable=True)
    result_json = Column(JSON, nullable=False)   # full response payload, stored for retrieval
