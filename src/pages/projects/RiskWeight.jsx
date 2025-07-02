import React, { useState } from "react";
import { Info, X } from "lucide-react";

// Expanded credit ratings and estimated PDs
const creditRatingToPD = {
  "AAA": 0.0001,
  "AA+": 0.00015,
  "AA": 0.0002,
  "AA-": 0.0003,
  "A+": 0.0004,
  "A": 0.0005,
  "A-": 0.001,
  "BBB+": 0.0015,
  "BBB": 0.002,
  "BBB-": 0.005,
  "BB+": 0.007,
  "BB": 0.01,
  "BB-": 0.02,
  "B+": 0.03,
  "B": 0.05,
  "B-": 0.07,
  "CCC": 0.2,
  "CC": 0.5,
  "C": 0.8,
  "D": 1,
};

// Map to Credit Quality Steps
const creditRatingToCQS = {
  "AAA": 1,
  "AA+": 1,
  "AA": 1,
  "AA-": 1,
  "A+": 2,
  "A": 2,
  "A-": 2,
  "BBB+": 3,
  "BBB": 3,
  "BBB-": 3,
  "BB+": 4,
  "BB": 4,
  "BB-": 4,
  "B+": 5,
  "B": 5,
  "B-": 5,
  "CCC": 6,
  "CC": 6,
  "C": 6,
  // "D" handled separately
};

// Credit Quality Steps to Basel risk weights
const cqsToRiskWeight = {
  1: 20,
  2: 50,
  3: 100,
  4: 100,
  5: 150,
  6: 150,
};

// Info text 
const infoTexts = {
  exposure: {
    title: "Net Exposure Amount",
    content: "How much money you're actually at risk of losing if the other party doesn't pay you back. This is after considering any money or assets that might reduce the risk."
  },
  creditRating: {
    title: "Counterparty Credit Rating",
    content: "A score that shows how likely the other party is to pay back what they owe. AAA is the safest, and ratings like CCC or D mean higher risk of not paying."
  },
  recoveryRate: {
    title: "Recovery Rate",
    content: "If the other party fails to pay, this is how much of your money you expect to get back. The rest is likely lost."
  },
  pd: {
    title: "Probability of Default (PD)",
    content: "How likely it is that the other party won’t be able to pay you back within a year. This is shown as a percentage."
  },
  lgd: {
    title: "Loss Given Default (LGD)",
    content: "How much you could lose if the other party doesn’t pay. It’s the part you don’t recover, shown as a percentage."
  },
  expectedLoss: {
    title: "Expected Loss (EL)",
    content: "The average amount you might lose in a year from this deal. It depends on how much you’re risking and how likely it is the other party won’t pay."
  },
  cqs: {
    title: "Credit Quality Step (CQS)",
    content: "A number from 1 to 6 that shows how strong the other party’s credit is. 1 is best, 6 is worst."
  },
  riskWeight: {
    title: "Regulatory Risk Weight",
    content: "How risky the deal is according to banking rules. Higher numbers mean more risk, so banks need to hold more capital."
  },
  capitalRequirement: {
    title: "Minimum Capital Requirement",
    content: "How much money a bank must keep aside just in case the other party doesn’t pay. This is to keep the bank safe."
  }
};


export default function CreditRiskCalculator() {
  const [formData, setFormData] = useState({
    exposure: "",
    creditRating: "A",
    recoveryRate: 0.4,
  });

  const [result, setResult] = useState(null);
  const [activePopup, setActivePopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "creditRating"
          ? value
          : name === "recoveryRate"
          // Convert recovery rate to a decimal between 0 and 1
          ? Math.min(Math.max(Number(value) / 100, 0), 1)
          : Number(value),
    }));
  };

  const calculateCreditRisk = ({ exposure, creditRating, recoveryRate }) => {
    const pd = creditRatingToPD[creditRating] ?? 0.01;
    const lgd = 1 - recoveryRate;
    const expectedLoss = exposure * pd * lgd;

    // Determine Credit Quality Step and risk weight
    let cqs = creditRatingToCQS[creditRating];
    let riskWeight;
    if (creditRating === "D") {
      riskWeight = 1250;
      cqs = "N/A";
    } else {
      cqs = cqs ?? "N/A";
      riskWeight = cqsToRiskWeight[cqs] ?? 150;
    }

    // Calculate capital requirement
    const capitalRequirement = exposure * (riskWeight / 100) * 0.08;

    return {
      // Convert values to appropriate formats
      pd: (pd * 100).toFixed(4),
      lgd: (lgd * 100).toFixed(1),
      expectedLoss: expectedLoss.toFixed(2),
      cqs,
      riskWeight,
      capitalRequirement: capitalRequirement.toFixed(2),
    };
  };

  const handleSubmit = () => {
    if (formData.exposure && formData.exposure > 0) {
      const res = calculateCreditRisk(formData);
      setResult(res);
    }
  };

  const InfoButton = ({ infoKey }) => (
    <button
      type="button"
      onClick={() => setActivePopup(infoKey)}
      className="btn btn-circle btn-xs btn-ghost ml-2 text-secondary hover:bg-secondary hover:text-secondary-content transition-colors"
      title="More information"
    >
      <Info size={12} />
    </button>
  );

  const InfoPopup = () => {
    if (!activePopup) return null;
    const info = infoTexts[activePopup];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-primary">{info.title}</h3>
              <button
                onClick={() => setActivePopup(null)}
                className="btn btn-circle btn-xs btn-ghost"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-base-content leading-relaxed">{info.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 p-6 text-base-content">
      <div className="max-w-lg mx-auto card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body">
          <h1 className="card-title text-primary text-3xl mb-2 font-bold">
            Credit Risk Calculator
          </h1>
          <p className="text-sm text-base-content opacity-70 mb-6">
            Calculate core credit risk metrics including expected loss and regulatory capital requirements.
          </p>

          <div className="form-control gap-4">
            <label className="label">
              <div className="flex items-center">
                <span className="label-text">Net Exposure Amount ($)</span>
                <InfoButton infoKey="exposure" />
              </div>
              <input
                type="number"
                name="exposure"
                value={formData.exposure}
                onChange={handleChange}
                className="input input-bordered focus:border-primary transition-colors"
                min={0}
                step="0.01"
                placeholder="Enter exposure amount"
                required
              />
            </label>

            <label className="label">
              <div className="flex items-center">
                <span className="label-text">Counterparty Credit Rating</span>
                <InfoButton infoKey="creditRating" />
              </div>
              <select
                name="creditRating"
                value={formData.creditRating}
                onChange={handleChange}
                className="select select-bordered focus:border-primary transition-colors"
                required
              >
                {Object.keys(creditRatingToPD).map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </label>

            <label className="label">
              <div className="flex items-center">
                <span className="label-text">Recovery Rate (%)</span>
                <InfoButton infoKey="recoveryRate" />
              </div>
              <input
                type="number"
                name="recoveryRate"
                value={(formData.recoveryRate * 100).toFixed(1)}
                onChange={handleChange}
                className="input input-bordered focus:border-primary transition-colors recovery-rate-input"
                min={0}
                max={100}
                step="0.1"
                required
              />
              <small className="text-xs text-base-content opacity-60">
                Typical range: 20-60%
              </small>
            </label>

            <button 
              type="button"
              onClick={handleSubmit} 
              className="btn btn-primary mt-2 shadow-lg hover:shadow-xl transition-all"
              disabled={!formData.exposure || formData.exposure <= 0}
            >
              Calculate Credit Risk Metrics
            </button>
          </div>

          {result && (
            <div className="mt-6 p-6 rounded-lg bg-base-300 shadow-inner border border-base-content border-opacity-10">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center">
                Credit Risk Analysis
                <div className="badge badge-accent ml-3 text-accent-content font-semibold">Results</div>
              </h2>
              
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary">
                  <div className="flex items-center">
                    <span><strong>Probability of Default (PD):</strong> <span className="text-secondary font-semibold">{result.pd}%</span></span>
                    <InfoButton infoKey="pd" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary">
                  <div className="flex items-center">
                    <span><strong>Loss Given Default (LGD):</strong> <span className="text-secondary font-semibold">{result.lgd}%</span></span>
                    <InfoButton infoKey="lgd" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-accent">
                  <div className="flex items-center">
                    <span><strong>Expected Loss (EL):</strong> <span className="text-accent font-bold">${result.expectedLoss}</span></span>
                    <InfoButton infoKey="expectedLoss" />
                  </div>
                </div>
                
                <div className="divider text-base-content opacity-50">Regulatory Metrics</div>
                
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
                  <div className="flex items-center">
                    <span><strong>Credit Quality Step (CQS):</strong> <span className="text-secondary font-semibold">{result.cqs}</span></span>
                    <InfoButton infoKey="cqs" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
                  <div className="flex items-center">
                    <span><strong>Risk Weight:</strong> <span className="text-secondary font-semibold">{result.riskWeight}%</span></span>
                    <InfoButton infoKey="riskWeight" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-accent">
                  <div className="flex items-center">
                    <span><strong>Min. Capital Requirement:</strong> <span className="text-accent font-bold">${result.capitalRequirement}</span></span>
                    <InfoButton infoKey="capitalRequirement" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <InfoPopup />
    </div>
  );
}
