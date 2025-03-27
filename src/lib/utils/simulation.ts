import { NextResponse } from 'next/server';
import { generateReportId } from './reportGenerator'; // Assuming reportGenerator is in the same directory

interface SimulationCheckParams {
  leadId?: string | null;
  // Add other parameters here if needed for more specific simulation responses in the future
  // email?: string | null; 
}

/**
 * Checks if simulation mode should be activated (missing Sanity token or simulated lead ID)
 * and returns an appropriate simulated NextResponse, or null if not in simulation mode.
 */
export function handleSimulationMode(params: SimulationCheckParams): NextResponse | null {
  const isSanityTokenMissing = !process.env.SANITY_API_TOKEN;
  const isSimulatedLeadId = params.leadId?.startsWith('sim_') ?? false;

  if (isSanityTokenMissing || isSimulatedLeadId) {
    const reason = isSanityTokenMissing ? 'SANITY_API_TOKEN não configurado' : 'ID de lead simulado detectado';
    console.log(`⚠️ Modo de simulação ativado: ${reason}`);

    // Generic simulated response - can be adapted later if needed per API
    const simulatedReportId = generateReportId();
    const reportUrl = `/relatorios/${simulatedReportId}`;

    // Note: The exact structure of the simulated response might need slight adjustments
    // depending on what the calling API expects in simulation mode (e.g., preview data for /submit).
    // For now, returning a generic success with simulated report details.
    return NextResponse.json({
      success: true,
      message: `MODO DE SIMULAÇÃO (${reason}): Operação simulada.`,
      simulatedMode: true,
      reportId: simulatedReportId, // Included for potential use
      reportUrl: reportUrl,       // Included for potential use
      // Add other simulated fields if necessary, e.g., a basic preview for /submit
      // preview: { ... } 
    });
  }

  // Not in simulation mode, return null to proceed with normal processing
  return null;
}
