import React from "react";

const Stats = ({ data }) => (
  <section style={{ marginRight: "2em" }}>
    <h1 style={{ fontSize: "2em" }}>
      <b style={{ color: `${data.color}` }}>react-dat-gui</b>
    </h1>
    <h2>Use the controls and watch your changes happen in real time!</h2>
    <section>
      <div>
        <b>String value:</b> {data.string}
      </div>
      <div>
        <b>Slider value:</b> {data.minMaxNumber}
      </div>
      <div>
        <b>Number value:</b> {data.number}
      </div>
      <div>
        <b>Checkbox value:</b> {data.boolean ? "true" : "false"}
      </div>
      <div>
        <b>Select value:</b> {data.select}
      </div>
      <div>
        <b>Picked color:</b>{" "}
        <div
          style={{
            width: "10px",
            height: "10px",
            display: "inline-block",
            backgroundColor: data.color
          }}
        />
      </div>
      <div>
        <b>Click the button for a random number:</b> {data.random}
      </div>
      <div>
        <b>Nested string value:</b> {data.nested.string}
      </div>
    </section>
  </section>
);

export default Stats;
