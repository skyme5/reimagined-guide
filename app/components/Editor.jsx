"use client";

import React, { useState } from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import {
  EditorContent,
  useEditor,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useReactNodeView,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styled from "styled-components";

const StyledNodeViewWrapper = styled(NodeViewWrapper)`
  padding: 1rem;
  position: relative;

  .floating-actions {
    display: flex;
    gap: 1rem;
    position: absolute;
    z-index: 1;
    transition: all ease-in-out 0.5s;
    opacity: 0;
  }

  &:hover .floating-actions {
    opacity: 1;
  }

  div[data-node-view-content] > div {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: grid;
    place-items: center;
    grid-auto-rows: 1fr;
    grid-auto-columns: 1fr;
    grid-template-areas: ${({ $layout }) => {
      if ($layout === "center") {
        return `"center"`;
      }

      if ($layout === "column") {
        return `"image" "content"`;
      }

      if ($layout === "row") {
        return `"image content"`;
      }

      if ($layout === "column-reverse") {
        return `"content" "image"`;
      }

      if ($layout === "row-reverse") {
        return `"content image"`;
      }
    }};

    & > .react-renderer {
      width: 100%;
      height: 100%;
      border: solid #ececec 1px;

      position: ${({ $layout }) =>
        $layout === "center" ? "absolute" : "relative"};

      &:nth-child(1) {
        grid-area: image;
      }

      &:nth-child(2) {
        grid-area: content;
      }
    }
  }
`;

const LayoutWrapperRenderer = ({ updateAttributes }) => {
  const [layout, setLayout] = useState("row");

  return (
    <StyledNodeViewWrapper $layout={layout}>
      <div className="floating-actions">
        <button onClick={() => setLayout("row")} className="">
          Row
        </button>
        <button onClick={() => setLayout("row-reverse")} className="">
          Row Reverse
        </button>
        <button onClick={() => setLayout("column")} className="">
          Column
        </button>
        <button onClick={() => setLayout("column-reverse")} className="">
          Column Reverse
        </button>
        <button onClick={() => setLayout("center")} className="">
          Center
        </button>
      </div>
      <NodeViewContent as="div" />
    </StyledNodeViewWrapper>
  );
};

const LayoutComponentExtension = Node.create({
  name: "LayoutWrapper",
  group: "block",
  content: "block+",
  draggable: true,

  parseHTML() {
    return [
      {
        tag: "layout-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutWrapperRenderer);
  },
});

const LayoutChildrenRenderer = (props) => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <NodeViewContent as="div" />
    </NodeViewWrapper>
  );
};

const Layout2ComponentExtension = Node.create({
  name: "LayoutChildren",
  group: "block",
  content: "block+",
  draggable: true,

  parseHTML() {
    return [
      {
        tag: "layout-children",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutChildrenRenderer);
  },
});

const extensions = [
  StarterKit,
  LayoutComponentExtension,
  Layout2ComponentExtension,
];

const content = `
  <layout-component>
    <layout-children>image</layout-children>
    <layout-children>content</layout-children>
  </layout-component>
`;

const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  return <EditorContent editor={editor} />;
};

export default Editor;
