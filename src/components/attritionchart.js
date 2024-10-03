import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AttritionData = ({ selectedYear, isAscending }) => { // Accept isAscending prop
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttritionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the Excel file from the public directory
      const response = await fetch("/attrition_data.xlsx");

      if (!response.ok) {
        throw new Error("Failed to fetch Excel file");
      }

      const blob = await response.blob();

      // Create a FormData object and append the Excel file
      const formData = new FormData();
      formData.append("file", blob, "attrition_data.xlsx");

      // Send the file to the API
      const apiResponse = await fetch(
        "https://api-attrition-shrinkage.onrender.com/get_attrition_data",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to process attrition data");
      }

      const responseData = await apiResponse.json();
      const parsedData = JSON.parse(responseData); // Parse the JSON string
      setApiResponse(parsedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttritionData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure the data is in the correct format
  if (!Array.isArray(apiResponse)) {
    return <div>Error: Unexpected response format</div>;
  }

  // Filter data based on the selected year
  const filteredData = selectedYear
    ? apiResponse.filter((item) => item.date.startsWith(selectedYear))
    : apiResponse;

  // Sort the filtered data based on the date in ascending or descending order
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return isAscending ? dateA - dateB : dateB - dateA; // Ascending or descending order
  });

  // Prepare data for the chart
  const labels = sortedData.map((item) => item.date);
  const attritionRates = sortedData.map((item) => item["Attrition Rate"]);

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Attrition Rate (%)",
        data: attritionRates,
        backgroundColor: "rgba(173, 216, 230, 0.6)", // Light blue bars
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Trend Line",
        data: attritionRates,
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Attrition Rates Over Time ${selectedYear ? `(${selectedYear})` : ""}`,
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
          text: "Attrition Percentage",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>Attrition API Response</h1>

      <div style={{ width: "600px", height: "500px", margin: "0 auto" }}>
        <Chart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AttritionData;
