import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Organization from "@/models/Organization"

/**
 * Helper: Convert HH:mm to minutes
 */
function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

/**
 * Validate shift overlaps
 */
function hasOverlap(shifts: any[]) {
    const timedShifts = shifts.filter(s => s.startTime && s.endTime)

    for (let i = 0; i < timedShifts.length; i++) {
        for (let j = i + 1; j < timedShifts.length; j++) {
            const aStart = timeToMinutes(timedShifts[i].startTime)
            const aEnd = timeToMinutes(timedShifts[i].endTime)
            const bStart = timeToMinutes(timedShifts[j].startTime)
            const bEnd = timeToMinutes(timedShifts[j].endTime)

            if (aStart < bEnd && bStart < aEnd) {
                return true
            }
        }
    }

    return false
}

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const body = await req.json()
        const { organizationId, totalSeats, shifts } = body

        if (!organizationId) {
            return NextResponse.json(
                { message: "Organization ID required" },
                { status: 400 }
            )
        }

        if (!totalSeats || totalSeats <= 0) {
            return NextResponse.json(
                { message: "Total seats must be greater than 0" },
                { status: 400 }
            )
        }

        if (!shifts || shifts.length === 0) {
            return NextResponse.json(
                { message: "At least one shift is required" },
                { status: 400 }
            )
        }

        /**
         * Validate seat totals inside shifts
         */
        const totalShiftSeats = shifts.reduce(
            (sum: number, shift: any) => sum + shift.totalSeats,
            0
        )

        if (totalShiftSeats > totalSeats) {
            return NextResponse.json(
                { message: "Shift seats cannot exceed total seats" },
                { status: 400 }
            )
        }

        /**
         * Validate time overlap
         */
        if (hasOverlap(shifts)) {
            return NextResponse.json(
                { message: "Shift timings overlap" },
                { status: 400 }
            )
        }

        /**
         * Find Organization
         */
        const organization = await Organization.findById(organizationId)

        if (!organization) {
            return NextResponse.json(
                { message: "Organization not found" },
                { status: 404 }
            )
        }

        /**
         * Prevent reconfiguration (Optional)
         */
        if (organization.isConfigured) {
            return NextResponse.json(
                { message: "Organization already configured" },
                { status: 400 }
            )
        }

        /**
         * Save Configuration
         */
        organization.seatConfig = {
            totalSeats,
            shifts,
        }

        Organization.findByIdAndUpdate(
            organizationId,
            {
                seatConfig: organization.seatConfig,
                isConfigured: true,
            },
            { new: true }
        ).then(updatedOrg => console.log(updatedOrg))
            .catch(err => console.error(err));
            
        return NextResponse.json({
            success: true,
            message: "Organization configured successfully",
        })
    } catch (error: any) {
        console.error("Setup Error:", error)

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}