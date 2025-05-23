import { Cluster, Connection } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";

export const getConnection = (cluster: string) => {
    return new Connection(clusterApiUrl(cluster as Cluster), 'confirmed');
}