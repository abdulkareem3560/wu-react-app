import React from "react";
import { ReactFormBuilder, Registry } from "react-form-builder2";
import "react-form-builder2/dist/app.css";

// 1. Define your custom components
const TestComponent = () => <h2>Hello</h2>;

const MyInput = React.forwardRef((props, ref) => {
  const { name, defaultValue, disabled } = props;
  return (
    <input
      ref={ref}
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
    />
  );
});

// 2. Register custom components with the Registry
Registry.register("MyInput", MyInput);
Registry.register("TestComponent", TestComponent);

// 3. Define toolbar items including your custom components
const toolbarItems = [
  {
    key: "TestComponent",
    element: "CustomElement",
    component: TestComponent,
    type: "custom",
    field_name: "test_component",
    name: "Something You Want",
    icon: "fa fa-cog",
    static: true,
    props: { test: "test_comp" },
    label: "Label Test",
  },
  {
    key: "MyInput",
    element: "CustomElement",
    component: MyInput,
    type: "custom",
    forwardRef: true,
    field_name: "my_input_",
    name: "My Input",
    icon: "fa fa-cog",
    props: { test: "test_input" },
    label: "Label Input",
  },
  // Standard components (no need to define full details unless customizing)
  { key: "Header" },
  { key: "TextInput" },
  { key: "TextArea" },
  { key: "RadioButtons" },
  { key: "Checkboxes" },
  { key: "Image" },
];

// 4. Use the toolbar in the form builder
const MyFormBuilder = () => (
  <div style={{ margin: "40px" }}>
    <h1>Custom React Form Builder</h1>
    <ReactFormBuilder toolbarItems={toolbarItems} />
  </div>
);

export default MyFormBuilder;
