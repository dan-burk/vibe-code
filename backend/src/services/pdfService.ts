import { spawn } from 'child_process';
import { writeFile, readFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import type { PdfRequest, WorkspaceItem, GraphState } from '../types/index.js';

/**
 * Escape special LaTeX characters in text
 */
function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, (match) => `\\${match}`)
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Generate LaTeX content for workspace items
 */
function generateWorkspaceLatex(items: WorkspaceItem[]): string {
  const lines: string[] = [];

  for (const item of items) {
    if (item.type === 'equation') {
      if (item.isBoxed) {
        // Boxed final answer
        lines.push(`\\[\\boxed{${item.content}}\\]`);
      } else {
        // Regular equation
        lines.push(`\\[${item.content}\\]`);
      }
    } else if (item.type === 'text') {
      lines.push(`\\noindent ${escapeLatex(item.content)}`);
    }
    lines.push(''); // Empty line between items
  }

  return lines.join('\n');
}

/**
 * Generate LaTeX content for graph description (since we can't embed Plotly directly)
 */
function generateGraphLatex(graphState: GraphState): string {
  const { points, lines, functions } = graphState;

  if (points.length === 0 && lines.length === 0 && functions.length === 0) {
    return '';
  }

  const graphLines: string[] = [
    '\\subsection*{Graph}',
    '\\begin{itemize}',
  ];

  for (const point of points) {
    const labelText = point.label ? ' (labeled "' + escapeLatex(point.label) + '")' : '';
    graphLines.push('  \\item Point at $(' + point.x + ', ' + point.y + ')$' + labelText);
  }

  for (const line of lines) {
    const pointStr = line.points.map((p) => `(${p[0]}, ${p[1]})`).join(' to ');
    graphLines.push(`  \\item Line through $${pointStr}$`);
  }

  for (const fn of functions) {
    graphLines.push(`  \\item Function: $${fn.latex}$`);
  }

  graphLines.push('\\end{itemize}');

  return graphLines.join('\n');
}

/**
 * Generate complete LaTeX document
 */
function generateLatexDocument(request: PdfRequest): string {
  const workspaceContent = generateWorkspaceLatex(request.workspaceItems);
  const graphContent = generateGraphLatex(request.graphState);

  return `\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage[margin=1in]{geometry}

\\title{Math Scribe - Student Work}
\\author{${request.studentName ? escapeLatex(request.studentName) : 'Student'}}
\\date{${escapeLatex(request.date)}}

\\begin{document}

\\maketitle

\\section*{Work}

${workspaceContent}

${graphContent}

\\end{document}
`;
}

/**
 * Compile LaTeX to PDF using pdflatex
 */
async function compilePdf(texContent: string): Promise<Buffer> {
  // Create temporary directory
  const tmpDir = join(tmpdir(), `mathscribe-${randomUUID()}`);
  await mkdir(tmpDir, { recursive: true });

  const texPath = join(tmpDir, 'document.tex');
  const pdfPath = join(tmpDir, 'document.pdf');

  try {
    // Write LaTeX file
    await writeFile(texPath, texContent, 'utf-8');

    // Run pdflatex (twice for proper references)
    await runPdflatex(texPath, tmpDir);
    await runPdflatex(texPath, tmpDir);

    // Read the generated PDF
    const pdfBuffer = await readFile(pdfPath);
    return pdfBuffer;
  } finally {
    // Clean up temporary directory
    try {
      await rm(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Run pdflatex command
 */
function runPdflatex(texPath: string, outputDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn('pdflatex', [
      '-interaction=nonstopmode',
      '-output-directory=' + outputDir,
      texPath,
    ]);

    let stderr = '';
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`pdflatex failed with code ${code}: ${stderr}`));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`Failed to run pdflatex: ${err.message}`));
    });
  });
}

/**
 * Generate PDF from workspace state
 * Returns base64-encoded PDF
 */
export async function generatePdf(request: PdfRequest): Promise<string> {
  const texContent = generateLatexDocument(request);
  const pdfBuffer = await compilePdf(texContent);
  return pdfBuffer.toString('base64');
}

/**
 * Check if pdflatex is available
 */
export async function checkPdflatex(): Promise<boolean> {
  return new Promise((resolve) => {
    const process = spawn('pdflatex', ['--version']);

    process.on('close', (code) => {
      resolve(code === 0);
    });

    process.on('error', () => {
      resolve(false);
    });
  });
}
