import { CartItem } from "@/app/types/cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { transaction_ref, date, items, total } = await req.json();

    const pad = (n: number) => n.toString().padStart(2, "0");

    const formatDate = (d: string | Date) => {
        const dt = new Date(d);
        return `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(
        dt.getSeconds()
        )} ${pad(dt.getDate())}-${dt.toLocaleString("en-US", {
        month: "long",
        })}-${dt.getFullYear()}`;
    };

    const subtotalBeforeDiscount = items.reduce(
        (acc: number, i: any) => acc + i.price * i.quantity,
        0
    );

    const totalDiscount = items.reduce(
        (acc: number, i: any) =>
        acc + i.price * i.discount * i.quantity,
        0
    );

    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=80mm, initial-scale=1">
        <style>
        @media print {
            @page {
            size: 80mm auto;
            margin: 0;
            }

            body {
            margin: 0;
            }
        }

        body {
            font-family: monospace;
            width: 80mm;
            padding: 8px;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin: 0;
            font-size: 16px;
        }

        .center {
            text-align: center;
            font-size: 11px;
        }

        .line {
            border-top: 1px dashed #000;
            margin: 6px 0;
        }

        .item {
            margin-bottom: 6px;
        }

        .row {
            display: flex;
            justify-content: space-between;
        }

        .total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 14px;
        }
        </style>
    </head>
    <body>
        <h2>KEDAI KELINCI</h2>
        <div class="center">REF: ${transaction_ref}</div>
        <div class="center">DATE: ${formatDate(date)}</div>

        <div class="line"></div>

        ${items
        .map((item: CartItem) => {
            const discountAmount = item.price * item.discount;
            const discounted = item.price - discountAmount;
            const totalItem = discounted * item.quantity;

            return `
            <div class="item">
                <div>${item.name}</div>

                ${
                item.discount > 0
                    ? `
                    <div class="row" style="font-size:11px;">
                        <span>$${item.price.toFixed(2)}</span>
                        <span>-$${discountAmount.toFixed(2)}</span>
                    </div>
                    <div style="font-size:11px;">Discount ${item.discount * 100}%</div>
                    `
                    : `<div style="font-size:11px;">$${item.price.toFixed(2)}</div>`
                }

                <div class="row" style="font-size:11px;">
                <span>${item.quantity} x $${discounted.toFixed(2)}</span>
                <span>$${totalItem.toFixed(2)}</span>
                </div>
            </div>
            `;
        })
        .join("")}

        <div class="line"></div>

        <div style="font-size:12px;">
        <div class="row">
            <span>SUBTOTAL</span>
            <span>$${subtotalBeforeDiscount.toFixed(2)}</span>
        </div>
        <div class="row">
            <span>DISCOUNT</span>
            <span>-$${totalDiscount.toFixed(2)}</span>
        </div>
        </div>

        <div class="line"></div>

        <div class="total">
        <span>TOTAL</span>
        <span>$${total.toFixed(2)}</span>
        </div>

        <div class="line"></div>
        <div class="center" style="margin-top:4px;">
        Congrats!! YOU SAVED $${totalDiscount.toFixed(2)}
        </div>
        <p class="center">Thank you</p>
    </body>
    </html>
    `;

    return NextResponse.json({ html: receiptHTML });
}