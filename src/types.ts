/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Used to dynamically map Lucide icons
  tags: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  stats?: {
    label: string;
    value: string;
  };
  link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
}

export interface Metric {
  id: string;
  value: string;
  label: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  details: string[];
}
