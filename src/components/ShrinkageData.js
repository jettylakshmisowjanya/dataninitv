import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, Filler);

const ShrinkageData = ({ selectedYear, isAscending }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShrinkageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/shrinkage_data.xlsx");
      if (!response.ok) {
        throw new Error("Failed to fetch Excel file");
      }

      const excelFile = await response.arrayBuffer();
      const formData = new FormData();
      formData.append('file', new Blob([excelFile]), 'shrinkage_data.xlsx');

      const apiResponse = await fetch('https://api-attrition-shrinkage.onrender.com/get_shrinkage_data', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const jsonData = await apiResponse.json();
      console.log(jsonData);

      const labelsSet = new Set();
      const actualDataMap = new Map();
      const predictedDataMap = new Map();

      const predictions = jsonData["2024_predictions"];
      for (const key in predictions) {
        if (predictions.hasOwnProperty(key)) {
          const historicalData = predictions[key].Historical || [];
          const predictedData = predictions[key].Predictions || [];

          historicalData.forEach(item => {
            labelsSet.add(item.Date);
            if (!actualDataMap.has(item.Date)) {
              actualDataMap.set(item.Date, []);
            }
            actualDataMap.get(item.Date).push(item.Value);
          });

          predictedData.forEach(item => {
            labelsSet.add(item.Date);
            if (!predictedDataMap.has(item.Date)) {
              predictedDataMap.set(item.Date, []);
            }
            predictedDataMap.get(item.Date).push(item.Value);
          });
        }
      }

      const allLabels = Array.from(labelsSet).sort();
      const filteredLabels = selectedYear ? allLabels.filter(date => date.includes(selectedYear)) : allLabels;

      const allActualValues = filteredLabels.map(date => {
        const values = actualDataMap.get(date) || [];
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
      });

      const allPredictedValues = filteredLabels.map(date => {
        const values = predictedDataMap.get(date) || [];
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
      });

      // Combine labels and values into an array of objects for sorting
      const combinedData = filteredLabels.map((label, index) => ({
        label,
        actual: allActualValues[index],
        predicted: allPredictedValues[index],
      }));

      // Sort the combined data based on the label (date)
      combinedData.sort((a, b) => {
        const dateA = new Date(a.label);
        const dateB = new Date(b.label);
        return isAscending ? dateA - dateB : dateB - dateA; // Ascending or descending order
      });

      // Extract sorted labels and values
      const sortedLabels = combinedData.map(data => data.label);
      const sortedActualValues = combinedData.map(data => data.actual);
      const sortedPredictedValues = combinedData.map(data => data.predicted);

      // Set chart data
      setChartData({
        labels: sortedLabels,
        datasets: [
          {
            type: "line",
            label: "Actual",
            data: sortedActualValues,
            borderColor: "red",
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Predicted",
            data: sortedPredictedValues,
            borderColor: "blue",
            borderWidth: 3,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            yAxisID: "y",
          },
        ],
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShrinkageData();
  }, [selectedYear, isAscending]); // Re-fetch data when selectedYear or isAscending changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Actual vs Predicted Shrinkage Data",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Shrinkage Percentage",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>Shrinkage Data</h1>
      {chartData ? (
        <div style={{ width: "600px", height: "500px", margin: "0 auto" }}>
          <Chart data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div>No data found</div>
      )}
    </div>
  );
};

export default ShrinkageData;
