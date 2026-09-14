import {
  AlignmentType as Align,
  Document as Doc,
  HeadingLevel as Heading,
  Packer as Pack,
  Paragraph as Para,
  TextRun as Run,
} from "docx";
import { formatMoney } from "../calculations";
import { triggerBlobDownload } from "../export/download";
import { DISCLAIMER } from "./defaults";
import { calcEstimateTotals, lineAmount } from "./calc";
import { estimateFilename } from "./filename";
import type { EstimateAgreement } from "./types";

export async function downloadEstimateDocx(data: EstimateAgreement): Promise<void> {
  const totals = calcEstimateTotals(data);
  const accent = "0F766E";

  const children: Para[] = [
    new Para({
      heading: Heading.HEADING_1,
      spacing: { after: 60 },
      children: [
        new Run({
          text: "ESTIMATE & AGREEMENT",
          bold: true,
          color: accent,
          font: "Calibri",
          size: 36,
        }),
      ],
    }),
    new Para({
      spacing: { after: 200 },
      children: [
        new Run({
          text:
            data.documentNumber +
            "  ·  Issued " +
            data.issueDate +
            "  ·  Valid until " +
            data.validUntil,
          size: 18,
          color: "78716C",
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { after: 60 },
      children: [
        new Run({ text: "FROM", bold: true, size: 16, color: accent, font: "Calibri" }),
      ],
    }),
    new Para({
      children: [
        new Run({
          text: data.businessName || "—",
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { after: 160 },
      children: [
        new Run({
          text: [data.businessEmail, data.businessPhone].filter(Boolean).join(" · ") || " ",
          size: 18,
          color: "78716C",
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { after: 60 },
      children: [
        new Run({ text: "CLIENT", bold: true, size: 16, color: accent, font: "Calibri" }),
      ],
    }),
    new Para({
      children: [
        new Run({
          text: data.clientName || "—",
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { after: 160 },
      children: [
        new Run({
          text: [data.clientEmail, data.clientPhone].filter(Boolean).join(" · ") || " ",
          size: 18,
          color: "78716C",
          font: "Calibri",
        }),
      ],
    }),
  ];

  if (data.jobAddress || data.jobCityStateZip) {
    children.push(
      new Para({
        spacing: { after: 40 },
        children: [
          new Run({ text: "JOB ADDRESS", bold: true, size: 16, color: accent, font: "Calibri" }),
        ],
      }),
      new Para({
        spacing: { after: 160 },
        children: [
          new Run({
            text: [data.jobAddress, data.jobCityStateZip].filter(Boolean).join(", "),
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  if (data.timeline) {
    children.push(
      new Para({
        spacing: { after: 40 },
        children: [
          new Run({ text: "TIMELINE", bold: true, size: 16, color: accent, font: "Calibri" }),
        ],
      }),
      new Para({
        spacing: { after: 160 },
        children: [new Run({ text: data.timeline, size: 20, font: "Calibri" })],
      })
    );
  }

  children.push(
    new Para({
      spacing: { after: 80 },
      children: [
        new Run({ text: "SCOPE OF WORK", bold: true, size: 16, color: accent, font: "Calibri" }),
      ],
    })
  );

  if (data.scopeMode === "bullets") {
    const bullets = data.scopeBullets.map((b) => b.trim()).filter(Boolean);
    (bullets.length ? bullets : ["—"]).forEach((b) => {
      children.push(
        new Para({
          spacing: { after: 40 },
          children: [new Run({ text: "•  " + b, size: 20, font: "Calibri" })],
        })
      );
    });
  } else {
    data.lineItems.forEach((item) => {
      const amt = formatMoney(lineAmount(item), data.currency);
      children.push(
        new Para({
          spacing: { after: 40 },
          children: [
            new Run({
              text:
                (item.description || "—") +
                "  ·  " +
                String(item.quantity || 0) +
                (item.unit ? " " + item.unit : "") +
                " @ " +
                formatMoney(item.unitPrice, data.currency) +
                " = " +
                amt,
              size: 20,
              font: "Calibri",
            }),
          ],
        })
      );
    });
  }

  children.push(
    new Para({
      spacing: { before: 200 },
      alignment: Align.RIGHT,
      children: [
        new Run({
          text: "Estimate total: " + formatMoney(totals.subtotal, data.currency),
          bold: true,
          size: 26,
          color: accent,
          font: "Calibri",
        }),
      ],
    })
  );

  if (totals.depositAmount > 0) {
    children.push(
      new Para({
        alignment: Align.RIGHT,
        children: [
          new Run({
            text: "Deposit due: " + formatMoney(totals.depositAmount, data.currency),
            size: 20,
            font: "Calibri",
          }),
        ],
      }),
      new Para({
        alignment: Align.RIGHT,
        spacing: { after: 120 },
        children: [
          new Run({
            text: "Balance after deposit: " + formatMoney(totals.balanceDue, data.currency),
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  if (data.notes.trim()) {
    children.push(
      new Para({
        spacing: { before: 160 },
        children: [new Run({ text: "NOTES", bold: true, size: 16, color: accent, font: "Calibri" })],
      }),
      new Para({
        children: [new Run({ text: data.notes, size: 18, color: "78716C", font: "Calibri" })],
      })
    );
  }

  children.push(
    new Para({
      spacing: { before: 280 },
      children: [
        new Run({ text: "ACCEPTANCE", bold: true, size: 16, color: accent, font: "Calibri" }),
      ],
    }),
    new Para({
      spacing: { after: 200 },
      children: [
        new Run({
          text: "By signing, the client accepts this estimate as a simple work agreement for the scope described.",
          size: 18,
          color: "475569",
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { before: 200 },
      children: [
        new Run({
          text: "Client: ___________________________  Date: __________",
          size: 18,
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { before: 120, after: 200 },
      children: [
        new Run({
          text: "Provider: _________________________  Date: __________",
          size: 18,
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { before: 200 },
      children: [
        new Run({
          text: DISCLAIMER,
          italics: true,
          size: 14,
          color: "94A3B8",
          font: "Calibri",
        }),
      ],
    }),
    new Para({
      spacing: { before: 200 },
      children: [
        new Run({
          text: "AI Bloom — AI made simple. Learn. Try. Grow. · aibloom.agency",
          size: 14,
          color: "94A3B8",
          font: "Calibri",
          italics: true,
        }),
      ],
    })
  );

  const document = new Doc({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children,
      },
    ],
  });

  const blob = await Pack.toBlob(document);
  if (!blob || blob.size <= 0) throw new Error("Word export produced an empty file");
  await triggerBlobDownload(blob, estimateFilename(data.documentNumber, "docx"));
}
