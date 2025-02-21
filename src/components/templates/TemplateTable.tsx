"use client";
import { useTemplateStore } from "@/store/template.store";
import { FileTemplate, TEMPLATE_TABLE_COLUMNS } from "@/types/file-templates/template.types";
import { formatBytes } from "@/utils/format.utils";
import { FiEdit2, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useState } from "react";
import EditTemplateModal from "./EditTemplateModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function TemplateTable() {
  const { templates, loading, updateTemplate, deleteTemplate, toggleStatus } = useTemplateStore();
  const [editingTemplate, setEditingTemplate] = useState<FileTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<FileTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async (template: FileTemplate) => {
    try {
      await toggleStatus(template.id);
      toast.success(template.status ? 'Template deactivated' : 'Template activated');
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      toast.error(error.message || 'Failed to update template status');
    }
  };

  const handleEdit = (template: FileTemplate) => {
    setEditingTemplate(template);
  };

  const handleDelete = (template: FileTemplate) => {
    setTemplateToDelete(template);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTemplate(templateToDelete.id);
      toast.success("Template deleted successfully");
      setTemplateToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete template:", error);
      toast.error(error.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTableRow = (template: FileTemplate) => (
    <tr key={template.id}>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <p className="text-black dark:text-white">{template.name}</p>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <p className="text-black dark:text-white">{template.description}</p>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="flex flex-wrap gap-2">
          {template.fileTypes.map((type) => (
            <span
              key={type}
              className="inline-block rounded bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <p className="text-black dark:text-white">{formatBytes(template.maxSize)}</p>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <p className="text-black dark:text-white">
          {template.isRequired ? "Yes" : "No"}
        </p>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <span
          className={`inline-block rounded px-3 py-1 text-sm font-medium ${
            template.status
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {template.status ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={() => handleToggleStatus(template)}
            className="hover:text-primary"
            title={template.status ? "Deactivate" : "Activate"}
          >
            {template.status ? (
              <FiToggleRight className="h-5 w-5" />
            ) : (
              <FiToggleLeft className="h-5 w-5" />
            )}
          </button>
          <button 
            onClick={() => handleEdit(template)}
            className="hover:text-primary"
            title="Edit Template"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button 
            onClick={() => handleDelete(template)}
            className="hover:text-danger"
            title="Delete Template"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {TEMPLATE_TABLE_COLUMNS.map((column) => (
                <th
                  key={column.id}
                  className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading.table ? (
              <tr>
                <td
                  colSpan={TEMPLATE_TABLE_COLUMNS.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td
                  colSpan={TEMPLATE_TABLE_COLUMNS.length}
                  className="text-center py-8"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No templates found
                  </p>
                </td>
              </tr>
            ) : (
              templates.map(renderTableRow)
            )}
          </tbody>
        </table>
      </div>

      {editingTemplate && (
        <EditTemplateModal
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          template={editingTemplate}
          onUpdate={updateTemplate}
        />
      )}

      {templateToDelete && (
        <DeleteConfirmationModal
          isOpen={!!templateToDelete}
          onClose={() => setTemplateToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          templateName={templateToDelete.name}
        />
      )}
    </>
  );
} 