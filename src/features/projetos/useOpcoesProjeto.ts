import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Categoria, Prioridade, Status } from "@/types/database"

/**
 * Busca as listas de status, prioridades e categorias cadastradas.
 * Usado nos formulários de criação/edição de projeto (dropdowns) e
 * futuramente na tela de Configurações (Etapa 8).
 */
export function useOpcoesProjeto() {
  const [statusList, setStatusList] = useState<Status[]>([])
  const [prioridadesList, setPrioridadesList] = useState<Prioridade[]>([])
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [statusResp, prioridadesResp, categoriasResp] =
        await Promise.all([
          supabase.from("status").select("*").order("ordem"),
          supabase.from("prioridades").select("*").order("ordem"),
          supabase.from("categorias").select("*").order("nome"),
        ])

      setStatusList(statusResp.data ?? [])
      setPrioridadesList(prioridadesResp.data ?? [])
      setCategoriasList(categoriasResp.data ?? [])
      setCarregando(false)
    }

    carregar()
  }, [])

  return { statusList, prioridadesList, categoriasList, carregando }
}
