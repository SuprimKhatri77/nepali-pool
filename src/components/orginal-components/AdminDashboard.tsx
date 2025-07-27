"use client"

import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div><p>
            <Link href={"/admin/mentor-applications"}>Mentor-applications</Link></p></div>
    )
}