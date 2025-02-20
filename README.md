# ⚙ @rbxts/topbar-components

**Topbar Components** is a react component package that mimics [*topbar-plus*](https://devforum.roblox.com/t/v3-topbarplus-v300-construct-intuitive-topbar-icons-customise-them-with-themes-dropdowns-captions-labels-and-much-more/1017485) for [Roblox-TS](https://roblox-ts.com), with JSX markup support.

## 📦 Installation

**@rbxts/topbar-components** is available on [NPM](https://www.npmjs.com/package/@rbxts/ripple) and can be installed with the following commands:

```bash
npm install @rbxts/topbar-components
yarn add @rbxts/topbar-components
pnpm add @rbxts/topbar-components
```

### ⚡ Quick Start

Instantiate `<TopbarProvider />` to be a root of your topbar component tree.
```jsx
<TopbarProvider>
    <Icon text="Hello, World!" />
</TopbarProvider>
```
Every `<Icon />` can be in only two states `selected`, and `deselected`.
You can conditionally apply properties based on icon's current state, by providing a state markup object:
```jsx
<Icon text={{
    selected: "Selected!",
    deselected: "Deselected!",
}} />
```

You can add a dropdown to an icon by mounting `<Dropdown />` component as it's child:
Dropdowns & TopbarProvider have a property called `selectionMode`, which lets you specify how many icons can be selected at once.

```jsx
<Icon text="Skins">
    <Dropdown selectionMode="single">
        <Icon text="yellow" selected={() => chooseSkin("yellow")} />
        <Icon text="red" selected={() => chooseSkin("red")} />
    </Dropdown>
</Icon>
```

Dropdowns **can be nested.**

### 🎨 Stylesheets

You can use stylesheets to override default properties of all components within:
Stylesheets are partial, and work like patches to already established default properties within the package:

```jsx
<Stylesheet stylesheet={{
    icon: {
        textSize: 25,
        cornerRadius: new UDim(0.5, 0),
    }
}}>
    <Icon text="Skins">
        <Dropdown selectionMode="single">
            <Icon text="yellow" selected={() => chooseSkin("yellow")} />
            <Icon text="red" selected={() => chooseSkin("red")} />
        </Dropdown>
    </Icon>
</Stylesheet>
```

### 📝 License

Package is licensed under the MIT License.