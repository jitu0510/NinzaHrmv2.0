import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Pie,
  PieChart,
  Label,
} from "recharts";
import "../CSS/DashboardChartComponent.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getEmployeesExperienceData } from "./../Services/UserService";
import { useState, useEffect } from "react";
import acoe from "./ACOE3.png";

const url = process.env.REACT_APP_APP_URL;
const port = process.env.REACT_APP_APP_PORT;
const ChartComponent = () => {
  const [Piedata, setPiedata] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const history = useHistory();

  const colors = ["red", "blue", "green", "orange", "purple"];

  useEffect(() => {
    // Fetch your data from the API
    localStorage.setItem("page", "/dashboard/overview");

    axios
      .get(`http://49.249.28.218:8091/project-status-data`)
      .then((response) => {
        setPiedata([
          { name: "Created", value: response.data.created },
          { name: "Ongoing", value: response.data.onGoing },
          { name: "Not Applicable", value: response.data.na },
          { name: "Completed", value: response.data.completed },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch your data from the API
        getEmployeesExperienceData()
      .then((response) => {
        // Assuming your API response structure matches the provided example
        setEmployeeData([
          {
            name: "0-5 Years",
            "Number Of Employees": response.data.zeroToFive,
          },
          { name: "6-10 Years", "Number Of Employees": response.data.sixToTen },
          {
            name: "11-15 Years",
            "Number Of Employees": response.data.elevenToFifteen,
          },
          {
            name: "16-20 years",
            "Number Of Employees": response.data.sixteenToTwenty,
          },
          {
            name: ">20 Years",
            "Number Of Employees": response.data.greaterThanTwenty,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Array of colors
  const piecolors = ["#FF5733", "#33FF57", "#5733FF", "#FFD700"];

  return (
    <div>
      <div className="charts-container">
  {/* Employees Chart + Table */}
  <div className="chart-card-left">
    <h2>Employees</h2>
    <BarChart width={450} height={300} data={employeeData}>
      <XAxis
        dataKey="name"
        interval={0}
        tick={{ fontSize: 8 }}
        angle={-30}
        textAnchor="end"
      />
      <YAxis label={{ value: "Number of Employees", angle : -90} }/>
      <Tooltip />
      <Legend />
      <Bar dataKey="Number Of Employees" name="Experience (Years)" fill="none">
        {employeeData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>

    {/* Employee Data Table */}
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Experience</th>
            <th>Number of Employees</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row["Number Of Employees"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Projects Chart + Table */}
  <div className="chart-card-right">
    <h2>Projects</h2>
    <PieChart width={400} height={300}>
      <Pie
        data={Piedata}
        cx={220}
        cy={120}
        innerRadius={70}
        outerRadius={110}
        fill="#8884d8"
        dataKey="value"
      >
        {Piedata.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={piecolors[index % piecolors.length]}
          />
        ))}
        <Label value="Status" position="center" />
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
    </PieChart>

    {/* Project Data Table */}
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Piedata.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

      {/* <div style={{ marginLeft: "35%", marginTop: "5%" }}>
        <footer>
          Designed and Developed by <img src={acoe} alt="" width="40px" />{" "}
        </footer>
      </div> */}
    </div>
  );
};
export default ChartComponent;
