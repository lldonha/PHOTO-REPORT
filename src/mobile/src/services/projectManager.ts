// Project Manager - Handle current active project

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../types/photo';
import { getProjects, createProject } from './database';

const CURRENT_PROJECT_KEY = '@photo_report:current_project';

export async function getCurrentProject(): Promise<Project> {
    try {
        const stored = await AsyncStorage.getItem(CURRENT_PROJECT_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

        // If no project stored, get or create default
        const projects = await getProjects();

        if (projects.length > 0) {
            const project = projects[0];
            await setCurrentProject(project);
            return project;
        }

        // Create default project
        const defaultProject: Project = {
            id: 'default',
            name: 'Projeto Padrão',
            description: 'Fotos sem projeto específico',
            createdAt: new Date().toISOString()
        };

        await createProject(defaultProject);
        await setCurrentProject(defaultProject);

        return defaultProject;
    } catch (error) {
        console.error('Error getting current project:', error);
        throw error;
    }
}

export async function setCurrentProject(project: Project): Promise<void> {
    try {
        await AsyncStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
    } catch (error) {
        console.error('Error setting current project:', error);
        throw error;
    }
}

export async function updateCurrentProjectName(name: string): Promise<Project> {
    try {
        const current = await getCurrentProject();

        // Create new project with updated name
        const updated: Project = {
            ...current,
            name,
        };

        await setCurrentProject(updated);
        return updated;
    } catch (error) {
        console.error('Error updating project name:', error);
        throw error;
    }
}
