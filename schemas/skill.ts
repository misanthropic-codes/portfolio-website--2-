import { defineType, defineField } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
