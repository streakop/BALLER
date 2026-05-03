"use client";

import { useState } from "react";
import { logResourceViewAndRedirect } from "@/app/actions";

export default function ResourceList({
  resources,
  subject,
}: {
  resources: any[];
  subject: any;
}) {
  const [filterType, setFilterType] = useState("All");

  // Filter resources based on selected type
  const filteredResources =
    filterType === "All"
      ? resources
      : resources.filter((r) => r.resource_type === filterType);

  // Categorize resources
  const questionPapers = filteredResources.filter(
    (r) => r.resource_type === "Question Paper"
  );
  const studyMaterial = filteredResources.filter(
    (r) => r.resource_type === "Study Material"
  );
  const assignments = filteredResources.filter(
    (r) => r.resource_type === "Assignment"
  );

  const hasResources = filteredResources.length > 0;

  return (
    <>
      {/* 🔘 Filter Tabs */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {["All", "Question Paper", "Study Material", "Assignment"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "20px",
              border: `1px solid ${
                filterType === type ? "var(--color-cf-text)" : "var(--color-cf-border)"}`,
              background:
                filterType === type ? "var(--color-cf-bgg)" : "var(--color-cf-bg)",
              color:
                filterType === type ? "var(--color-cf-text)" : "var(--color-cf-text)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ❌ No data */}
      {!hasResources && (
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          No resources found.
        </div>
      )}

      {/* Sections */}
      {hasResources && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Question Papers */}
          {questionPapers.length > 0 && (
            <Section title="Question Papers">
              {questionPapers.map((res) => (
                <ResourceCard key={res.id} res={res} />
              ))}
            </Section>
          )}

          {/*Notes */}
          {studyMaterial.length > 0 && (
            <Section title="Study Material">
              {studyMaterial.map((res) => (
                <ResourceCard key={res.id} res={res} />
              ))}
            </Section>
          )}

          {/*Assignments */}
          {assignments.length > 0 && (
            <Section title="Assignments">
              {assignments.map((res) => (
                <ResourceCard key={res.id} res={res} />
              ))}
            </Section>
          )}
        </div>
      )}
    </>
  );
}

/* 🔹 Section Wrapper */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        style={{
          marginBottom: "0.8rem",
          fontSize: "1.1rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.3rem",
        }}
      >
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}

/* 🔹 Resource Card */
function ResourceCard({ res }: { res: any }) {
  return (
    <div
      style={{
        padding: "0.6rem 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <form
        action={logResourceViewAndRedirect.bind(null, res.id, res.file_url)}
        style={{ margin: 0 }}
      >
        <button
          type="submit"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "#0070f3",
            textDecoration: "underline",
            padding: 0,
            fontSize: "0.95rem",
          }}
        >
          Download
        </button>
      </form>

      {/* Metadata */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#666",
          marginTop: "0.2rem",
        }}
      >
        {res.semester} • {res.exam_type}
        {(res.slot || res.faculty) && (
          <> • {[res.slot, res.faculty].filter(Boolean).join(" • ")}</>
        )}
      </div>
    </div>
  );
}