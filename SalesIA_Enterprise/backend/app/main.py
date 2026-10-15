from contextlib import asynccontextmanager
from datetime import date, datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
import os
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import create_engine, String, Integer, Numeric, Date, DateTime, ForeignKey, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session, sessionmaker


def database_url() -> str:
    url = os.getenv("DATABASE_URL", "sqlite:///./salesia.db")
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url

DB_URL = database_url()
engine = create_engine(DB_URL, pool_pre_ping=True, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

class Base(DeclarativeBase): pass

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    doc: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(30), default="Empresa")
    email: Mapped[str] = mapped_column(String(180), default="")
    phone: Mapped[str] = mapped_column(String(60), default="")
    address: Mapped[str] = mapped_column(String(250), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), default="General")
    price: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[int] = mapped_column(Integer, default=1)

class Sale(Base):
    __tablename__ = "sales"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    number: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    document_type: Mapped[str] = mapped_column(String(40), default="Factura")
    issue_date: Mapped[date] = mapped_column(Date, default=date.today)
    status: Mapped[str] = mapped_column(String(30), default="Pendiente")
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    discount: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)
    tax: Mapped[Decimal] = mapped_column(Numeric(12,2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    customer: Mapped[Customer] = relationship()
    details: Mapped[list["SaleDetail"]] = relationship(back_populates="sale", cascade="all, delete-orphan")

class SaleDetail(Base):
    __tablename__ = "sale_details"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    line_total: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    sale: Mapped[Sale] = relationship(back_populates="details")
    product: Mapped[Product] = relationship()

class Payment(Base):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    method: Mapped[str] = mapped_column(String(40), default="Por definir")
    status: Mapped[str] = mapped_column(String(30), default="Pendiente")
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class InventoryMovement(Base):
    __tablename__ = "inventory_movements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    sale_id: Mapped[Optional[int]] = mapped_column(ForeignKey("sales.id"), nullable=True)
    movement_type: Mapped[str] = mapped_column(String(20), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    note: Mapped[str] = mapped_column(String(250), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
