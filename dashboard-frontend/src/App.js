import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./Chart.js";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL,
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => moment(item).format("DD MMM");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

class App extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Users"
              query={{ measures: ["Users.count"] }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Users.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Orders"
              query={{ measures: ["Orders.count"] }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Completed Orders"
              query={{
                measures: ["Orders.count"],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["completed"],
                  },
                ],
              }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Shipped Orders"
              query={{
                measures: ["Orders.count"],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["shipped"],
                  },
                ],
              }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Orders in Process"
              query={{
                measures: ["Orders.count"],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["processing"],
                  },
                ],
              }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Orders completed for last month"
              query={{
                measures: ["Orders.count"],
                timeDimensions: [
                  {
                    dimension: "Orders.createdAt",
                    dateRange: ["2023-11-01", "2023-11-30"],
                    granularity: "day",
                  },
                ],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["completed"],
                  },
                ],
              }}
              render={(resultSet) => {
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resultSet.chartPivot()}>
                      <XAxis tickFormatter={dateFormatter} dataKey="x" />
                      <YAxis tickFormatter={numberFormatter} />
                      <Bar
                        dataKey="Orders.count"
                        name="Completed"
                        fill="#7DB3FF"
                      />

                      <Legend />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                );
              }}
            />
          </Col>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="New Users for Last Month"
              query={{
                measures: ["Users.count"],
                timeDimensions: [
                  {
                    dimension: "Users.createdAt",
                    dateRange: ["2019-12-01", "2019-12-31"],
                    granularity: "day",
                  },
                ],
              }}
              render={(resultSet) => (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="category" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Users.count"
                      name="Users"
                      stroke="rgb(106, 110, 229)"
                      fill="rgba(106, 110, 229, .16)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Orders by Status Over time"
              query={{
                measures: ["Orders.count"],
                dimensions: ["Orders.status"],
                timeDimensions: [
                  {
                    dimension: "Orders.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month",
                  },
                ],
              }}
              render={(resultSet) => {
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resultSet.chartPivot()}>
                      <XAxis tickFormatter={dateFormatter} dataKey="x" />
                      <YAxis tickFormatter={numberFormatter} />
                      <Bar
                        stackId="a"
                        dataKey="shipped, Orders.count"
                        name="Shipped"
                        fill="#7DB3FF"
                      />
                      <Bar
                        stackId="a"
                        dataKey="processing, Orders.count"
                        name="Processing"
                        fill="#49457B"
                      />
                      <Bar
                        stackId="a"
                        dataKey="completed, Orders.count"
                        name="Completed"
                        fill="#FF7C78"
                      />
                      <Legend />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                );
              }}
            />
          </Col>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="New Users Over Time"
              query={{
                measures: ["Users.count"],
                timeDimensions: [
                  {
                    dimension: "Users.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month",
                  },
                ],
              }}
              render={(resultSet) => (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="category" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Users.count"
                      name="Users"
                      stroke="rgb(106, 110, 229)"
                      fill="rgba(106, 110, 229, .16)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
