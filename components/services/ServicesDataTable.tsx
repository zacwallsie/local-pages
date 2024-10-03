"use client"

import * as React from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Service } from "@/types/supabase"
import { CreateServiceDialog } from "./CreateServiceDialog"
import { getServicesAction, updateServiceAction, deleteServiceAction } from "@/app/api/service"
import { useToast } from "@/hooks/use-toast"
import { SkeletonLoadingCard } from "@/components/shared/SkeletonLoadingCard"
import { createColumns } from "./columns"

type ServicesDataTableProps = {
	companyId: string
	userEmail: string
}

export function ServicesDataTable({ companyId, userEmail }: ServicesDataTableProps) {
	const [services, setServices] = React.useState<Service[]>([])
	const [loading, setLoading] = React.useState(true)
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const { toast } = useToast()

	const loadServices = React.useCallback(async () => {
		setLoading(true)
		try {
			const result = await getServicesAction(companyId)
			if (result.success && result.data) {
				setServices(result.data)
			} else {
				toast({
					title: "Error",
					description: result.success ? "Services fetched but data is missing" : result.error,
					variant: "destructive",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch services",
				variant: "destructive",
			})
		} finally {
			setLoading(false)
		}
	}, [companyId, toast])

	React.useEffect(() => {
		loadServices()
	}, [loadServices])

	const handleServiceCreated = (newService: Service) => {
		setServices((prevServices) => [...prevServices, newService])
	}

	const handleServiceUpdated = async (updatedService: Partial<Service>) => {
		try {
			const formData = new FormData()
			formData.append("id", updatedService.id!)
			formData.append("name", updatedService.name!)
			formData.append("description", updatedService.description!)
			formData.append("category", updatedService.category!)

			const result = await updateServiceAction(formData)
			if (result.success && result.data) {
				setServices((prevServices) =>
					prevServices.map((service) => (service.id === updatedService.id ? { ...service, ...result.data } : service))
				)
				toast({
					title: "Success",
					description: "Service updated successfully",
				})
			} else if (!result.success) {
				toast({
					title: "Error",
					description: result.error || "Failed to update service",
					variant: "destructive",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update service",
				variant: "destructive",
			})
		}
	}

	const handleServiceDeleted = async (serviceId: string) => {
		try {
			const result = await deleteServiceAction(serviceId)
			if (result.success) {
				setServices((prevServices) => prevServices.filter((service) => service.id !== serviceId))
				toast({
					title: "Success",
					description: "Service deleted successfully",
				})
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to delete service",
					variant: "destructive",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete service",
				variant: "destructive",
			})
		}
	}

	const columns = createColumns({
		onServiceUpdated: handleServiceUpdated,
		onServiceDeleted: handleServiceDeleted,
	})

	const table = useReactTable({
		data: services,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	if (loading) {
		return <SkeletonLoadingCard />
	}

	return (
		<Card className="w-full bg-aerial-white">
			<CardHeader className="bg-gray-200">
				<div className="flex justify-between items-center">
					<CardTitle className="text-2xl font-bold text-gray-800">Manage your Services</CardTitle>
					<CreateServiceDialog companyId={companyId} userEmail={userEmail} onServiceCreated={handleServiceCreated} />
				</div>
				<CardDescription className="max-w-xl">
					Manage your company's services. These services will be used for potential customers to search for your business within their area.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between py-4">
					<Input
						placeholder="Filter services..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border border-gray-200 overflow-hidden">
					<Table>
						<TableHeader className="bg-gray-100">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="font-bold text-gray-700">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50">
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
										No services found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-gray-600">{table.getFilteredRowModel().rows.length} service(s) total.</div>
					<div className="space-x-2">
						<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
