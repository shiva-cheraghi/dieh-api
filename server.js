import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BASE = 16000000;

// تبدیل ارقام فارسی به انگلیسی
function persianToEnglish(str = "") {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

// استخراج درصد
function extractPercents(text) {
  text = persianToEnglish(text);
  const regex = /(\d+(?:\.\d+)?|\d+,\d+)\s*(%|درصد)/g;

  let list = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    list.push(parseFloat(m[1].replace(",", ".")));
  }
  return list;
}

app.post("/dieh", (req, res) => {
  try {
    const text = req.body.text || "";
    const percents = extractPercents(text);
    const total = percents.reduce((a, b) => a + b, 0);
    const amount = Math.round((total / 100) * BASE);

    return res.json({
      percents,
      totalPercent: total,
      amount
    });

  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
});

app.get("/", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("API running on", port));
