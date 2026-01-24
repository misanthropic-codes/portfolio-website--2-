import { defineType, defineField } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
    }),
    defineField({
      name: "start",
      title: "Start Date",
      type: "string",
    }),
    defineField({
      name: "end",
      title: "End Date",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "percentage",
      title: "Percentage/GPA",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "activities",
      title: "Activities",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
