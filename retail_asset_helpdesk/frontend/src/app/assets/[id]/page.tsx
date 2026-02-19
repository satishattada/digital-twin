"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { Asset, Message, MaintenanceRecord, IssueRecord } from "@/types";
import {
  ChatMessage,
  TypingIndicator,
  ChatInput,
  ChatSuggestions,
  EscalationForm,
  EscalationData,
} from "@/components/chat";
import { Button } from "@/components/ui";
import { generateId } from "@/utils";
import styles from "./asset-details.module.css";

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = params.id as string;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "config" | "maintenance" | "issues" | "chat"
  >("chat");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    loadAsset();
  }, [assetId]);

  const loadAsset = async () => {
    try {
      setLoading(true);
      const data = await api.getAsset(assetId);

      // Helper function to get image URL based on category
      const getAssetImageUrl = (category: string) => {
        const imageMap: { [key: string]: string } = {
          coffee_machine: "/assets/coffee-machine.webp",
          oven: "/assets/oven.webp",
          refrigerator: "/assets/refrigrator.jpeg",
          freezer: "/assets/freezer.jpeg",
          dishwasher: "/assets/poc.jpeg",
          microwave: "/assets/oven.webp",
          pos_terminal: "/assets/poc.jpeg",
          display_cooler: "/assets/cooler.jpeg",
          ice_machine: "/assets/ice-machine.jpeg",
          hvac: "/assets/hvac.jpeg",
        };
        return imageMap[category] || "/assets/poc.jpeg";
      };

      // Mock data for demonstration - in production, this would come from API
      const enhancedData: Asset = {
        ...data,
        installationDate: "2023-06-15",
        warrantyExpiry: "2026-06-15",
        imageUrl: getAssetImageUrl(data.category),
        specifications: {
          voltage: "220V AC",
          power: "1450W",
          capacity: "12 cups",
          dimensions: "35cm x 25cm x 45cm",
          weight: "6.5 kg",
          connectivity: "Wi-Fi enabled",
        },
        maintenanceHistory: [
          {
            id: "m1",
            date: "2026-02-10",
            type: "routine",
            description: "Regular cleaning and descaling",
            technician: "John Smith",
            cost: 85,
            partsReplaced: ["Water filter"],
            nextDueDate: "2026-03-10",
          },
          {
            id: "m2",
            date: "2026-01-15",
            type: "preventive",
            description: "Preventive maintenance check",
            technician: "Sarah Johnson",
            cost: 120,
            partsReplaced: ["Heating element gasket"],
            nextDueDate: "2026-04-15",
          },
          {
            id: "m3",
            date: "2025-12-20",
            type: "corrective",
            description: "Replaced brewing unit",
            technician: "Mike Davis",
            cost: 250,
            partsReplaced: ["Brewing unit", "O-rings"],
          },
          {
            id: "m4",
            date: "2025-11-10",
            type: "routine",
            description: "Monthly maintenance",
            technician: "John Smith",
            cost: 75,
            partsReplaced: [],
          },
          {
            id: "m5",
            date: "2025-10-05",
            type: "routine",
            description: "Cleaning and inspection",
            technician: "Sarah Johnson",
            cost: 65,
            partsReplaced: [],
          },
          {
            id: "m6",
            date: "2025-09-12",
            type: "emergency",
            description: "Water leak repair",
            technician: "Mike Davis",
            cost: 180,
            partsReplaced: ["Water pump", "Seals"],
          },
        ],
        issueHistory: [
          {
            id: "i1",
            reportedDate: "2026-02-05",
            resolvedDate: "2026-02-05",
            issueType: "Water flow issue",
            severity: "medium",
            description: "Machine not dispensing water properly",
            resolution:
              "Cleaned water line and replaced filter. Tested successfully.",
            downtime: "2 hours",
            cost: 45,
            status: "resolved",
          },
          {
            id: "i2",
            reportedDate: "2025-12-18",
            resolvedDate: "2025-12-20",
            issueType: "Brewing failure",
            severity: "high",
            description: "Machine stops mid-brew cycle",
            resolution: "Replaced faulty brewing unit and recalibrated system.",
            downtime: "2 days",
            cost: 250,
            status: "resolved",
          },
          {
            id: "i3",
            reportedDate: "2025-11-22",
            resolvedDate: "2025-11-22",
            issueType: "Temperature inconsistency",
            severity: "low",
            description: "Coffee temperature lower than expected",
            resolution:
              "Adjusted thermostat settings and cleaned heating element.",
            downtime: "1 hour",
            cost: 35,
            status: "resolved",
          },
          {
            id: "i4",
            reportedDate: "2025-09-10",
            resolvedDate: "2025-09-12",
            issueType: "Water leak",
            severity: "critical",
            description: "Water leaking from bottom of machine",
            resolution:
              "Replaced water pump and all seals. System pressure tested.",
            downtime: "2 days",
            cost: 180,
            status: "resolved",
          },
          {
            id: "i5",
            reportedDate: "2025-07-15",
            resolvedDate: "2025-07-15",
            issueType: "Grinder jam",
            severity: "medium",
            description: "Coffee grinder making unusual noise and jamming",
            resolution:
              "Removed foreign object and cleaned grinder thoroughly.",
            downtime: "3 hours",
            cost: 60,
            status: "resolved",
          },
          {
            id: "i6",
            reportedDate: "2025-05-20",
            resolvedDate: "2025-05-21",
            issueType: "Display error",
            severity: "low",
            description: "Error code E03 on display",
            resolution: "Software update and sensor recalibration.",
            downtime: "1 day",
            cost: 95,
            status: "resolved",
          },
          {
            id: "i7",
            reportedDate: "2025-04-08",
            resolvedDate: "2025-04-08",
            issueType: "Weak coffee",
            severity: "low",
            description: "Coffee output weaker than normal",
            resolution: "Descaled machine and adjusted brew strength settings.",
            downtime: "2 hours",
            cost: 40,
            status: "resolved",
          },
          {
            id: "i8",
            reportedDate: "2025-03-12",
            resolvedDate: "2025-03-14",
            issueType: "Power issue",
            severity: "high",
            description: "Machine not powering on",
            resolution:
              "Replaced power supply unit and checked all electrical connections.",
            downtime: "2 days",
            cost: 220,
            status: "resolved",
          },
        ],
      };

      setAsset(enhancedData);
      setError(null);
    } catch (err) {
      console.error("Failed to load asset:", err);
      setError("Failed to load asset details");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleIssueResolved = () => {
    setShowFollowUp(false);
    setMessages([]);
    alert('Great! Issue marked as resolved.');
  };

  const handleTryAgain = () => {
    setShowFollowUp(false);
    setInput('');
  };

  const handleEscalateFromFollowUp = () => {
    setShowFollowUp(false);
    setShowEscalation(true);
  };

  const handleEscalationSubmit = async (data: EscalationData) => {
    try {
      // TODO: Replace with actual API call
      console.log("Escalation submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "Your issue has been escalated successfully! Our team will contact you shortly.",
      );
      setShowEscalation(false);
    } catch (error) {
      console.error("Failed to submit escalation:", error);
      alert("Failed to submit escalation. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isQuerying || !asset) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
      assetId: asset.id,
      assetName: asset.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsQuerying(true);

    try {
      const response = await api.queryDocuments(
        trimmedInput,
        asset.category,
        undefined,
      );

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setShowFollowUp(true);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "#10b981";
      case "maintenance":
        return "#f59e0b";
      case "faulty":
        return "#ef4444";
      case "offline":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>⚠️ Error</h2>
          <p>{error || "Asset not found"}</p>
          <Link href="/">
            <Button>← Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/assets">
          <Button variant="ghost">← Back to Assets</Button>
        </Link>
        <img src="/logo.png" alt="BP" className={styles.logo} />
        <h1>Asset Details</h1>
      </header>

      <div className={styles.content}>
        {/* Asset Info Card */}
        <div className={styles.assetCard}>
          {asset.imageUrl && (
            <div className={styles.assetImageContainer}>
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className={styles.assetImage}
              />
            </div>
          )}
          <div className={styles.assetHeader}>
            <div>
              <h2>{asset.name}</h2>
              <p className={styles.model}>
                {asset.manufacturer} - {asset.model}
              </p>
            </div>
            <div
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(asset.status) }}
            >
              {asset.status.toUpperCase()}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.assetTabs}>
            <button
              className={`${styles.assetTab} ${activeTab === "overview" ? styles.activeAssetTab : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`${styles.assetTab} ${activeTab === "config" ? styles.activeAssetTab : ""}`}
              onClick={() => setActiveTab("config")}
            >
              ⚙️ Configuration
            </button>
            <button
              className={`${styles.assetTab} ${activeTab === "maintenance" ? styles.activeAssetTab : ""}`}
              onClick={() => setActiveTab("maintenance")}
            >
              🔧 Maintenance (6M)
            </button>
            <button
              className={`${styles.assetTab} ${activeTab === "issues" ? styles.activeAssetTab : ""}`}
              onClick={() => setActiveTab("issues")}
            >
              ⚠️ Issues (1Y)
            </button>
            <button
              className={`${styles.assetTab} ${activeTab === "chat" ? styles.activeAssetTab : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              💬 Troubleshoot Error
            </button>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className={styles.mainContent}>
          {/* Tab Navigation */}
          {/* <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Troubleshoot Error
            </button>
          </div> */}

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className={styles.overview}>
                <div className={styles.assetDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Category:</span>
                    <span className={styles.value}>
                      {asset.category.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Serial Number:</span>
                    <span className={styles.value}>{asset.serialNumber}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Location:</span>
                    <span className={styles.value}>{asset.location}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Installation Date:</span>
                    <span className={styles.value}>
                      {asset.installationDate
                        ? new Date(asset.installationDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Warranty Expiry:</span>
                    <span className={styles.value}>
                      {asset.warrantyExpiry
                        ? new Date(asset.warrantyExpiry).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Last Maintenance:</span>
                    <span className={styles.value}>
                      {new Date(asset.lastMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>🔧</div>
                    <div className={styles.statValue}>
                      {asset.maintenanceHistory?.length || 0}
                    </div>
                    <div className={styles.statLabel}>Maintenance Records</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>⚠️</div>
                    <div className={styles.statValue}>
                      {asset.issueHistory?.length || 0}
                    </div>
                    <div className={styles.statLabel}>Issues Reported</div>
                  </div>
                  {/* <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statValue}>
                      $
                      {asset.maintenanceHistory
                        ?.reduce((sum, m) => sum + (m.cost || 0), 0)
                        .toFixed(0)}
                    </div>
                    <div className={styles.statLabel}>
                      Total Maintenance Cost
                    </div>
                  </div> */}
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏱️</div>
                    <div className={styles.statValue}>
                      {asset.issueHistory?.filter(
                        (i) => i.status === "resolved",
                      ).length || 0}
                      /{asset.issueHistory?.length || 0}
                    </div>
                    <div className={styles.statLabel}>Issues Resolved</div>
                  </div>
                </div>

                <div className={styles.recentActivity}>
                  <h3>Recent Activity</h3>
                  <div className={styles.timeline}>
                    {asset.maintenanceHistory?.slice(0, 3).map((record) => (
                      <div key={record.id} className={styles.timelineItem}>
                        <div className={styles.timelineDate}>
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTitle}>
                            {record.description}
                          </div>
                          <div className={styles.timelineMeta}>
                            Type: {record.type} | Technician:{" "}
                            {record.technician} | Cost: ${record.cost}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Configuration Tab */}
            {activeTab === "config" && (
              <div className={styles.configSection}>
                <h3>Technical Specifications</h3>
                {asset.specifications && (
                  <div className={styles.specGrid}>
                    {Object.entries(asset.specifications).map(
                      ([key, value]) => (
                        <div key={key} className={styles.specItem}>
                          <span className={styles.specLabel}>
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className={styles.specValue}>{value}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div className={styles.maintenanceSection}>
                <div className={styles.sectionHeader}>
                  <h3>Maintenance History (Last 6 Months)</h3>
                  <span className={styles.recordCount}>
                    {asset.maintenanceHistory?.length || 0} records
                  </span>
                </div>
                <div className={styles.recordsList}>
                  {asset.maintenanceHistory?.map((record) => (
                    <div key={record.id} className={styles.recordCard}>
                      <div className={styles.recordHeader}>
                        <div>
                          <div className={styles.recordTitle}>
                            {record.description}
                          </div>
                          <div className={styles.recordDate}>
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div
                          className={`${styles.recordType} ${styles[record.type]}`}
                        >
                          {record.type.toUpperCase()}
                        </div>
                      </div>
                      <div className={styles.recordDetails}>
                        <div className={styles.recordDetail}>
                          <strong>Technician:</strong> {record.technician}
                        </div>
                        {/* <div className={styles.recordDetail}>
                          <strong>Cost:</strong> ${record.cost}
                        </div> */}
                        {record.partsReplaced &&
                          record.partsReplaced.length > 0 && (
                            <div className={styles.recordDetail}>
                              <strong>Parts Replaced:</strong>{" "}
                              {record.partsReplaced.join(", ")}
                            </div>
                          )}
                        {record.nextDueDate && (
                          <div className={styles.recordDetail}>
                            <strong>Next Due:</strong>{" "}
                            {new Date(record.nextDueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issues Tab */}
            {activeTab === "issues" && (
              <div className={styles.issuesSection}>
                <div className={styles.sectionHeader}>
                  <h3>Issue History (Last 12 Months)</h3>
                  <span className={styles.recordCount}>
                    {asset.issueHistory?.length || 0} issues
                  </span>
                </div>
                <div className={styles.recordsList}>
                  {asset.issueHistory?.map((issue) => (
                    <div key={issue.id} className={styles.issueCard}>
                      <div className={styles.issueHeader}>
                        <div>
                          <div className={styles.issueTitle}>
                            {issue.issueType}
                          </div>
                          <div className={styles.issueDate}>
                            Reported:{" "}
                            {new Date(issue.reportedDate).toLocaleDateString()}
                            {issue.resolvedDate &&
                              ` | Resolved: ${new Date(issue.resolvedDate).toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className={styles.issueBadges}>
                          <div
                            className={`${styles.severityBadge} ${styles[issue.severity]}`}
                          >
                            {issue.severity.toUpperCase()}
                          </div>
                          <div
                            className={`${styles.statusBadge} ${styles[issue.status]}`}
                          >
                            {issue.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className={styles.issueBody}>
                        <div className={styles.issueDescription}>
                          <strong>Description:</strong> {issue.description}
                        </div>
                        {issue.resolution && (
                          <div className={styles.issueResolution}>
                            <strong>Resolution:</strong> {issue.resolution}
                          </div>
                        )}
                        <div className={styles.issueMetrics}>
                          {issue.downtime && (
                            <span className={styles.metric}>
                              ⏱️ Downtime: {issue.downtime}
                            </span>
                          )}
                          {/* {issue.cost && (
                            <span className={styles.metric}>
                              💰 Cost: ${issue.cost}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <div className={styles.chatSection}>
                {/* <div className={styles.messagesContainer}>
                
                    <div className={styles.emptyChatState}>
                      <p>Ask me anything about this {asset.category.replace(/_/g, ' ')}!</p>
                      <ChatSuggestions
                        onSuggestionClick={handleSuggestionClick}
                        selectedAsset={asset.name}
                      />
                    </div>
                  

                </div> */}
   <>
                  <div className={styles.messages}>
                    {messages.map((message) => (  
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isQuerying && <TypingIndicator />}
                    
                    {showFollowUp && !isQuerying && messages.length > 0 && (
                      <div className={styles.followUpPrompt}>
                        <p>Was this helpful?</p>
                        <div className={styles.followUpActions}>
                          <button
                            onClick={handleIssueResolved}
                            className={styles.resolvedButton}
                          >
                            ✓ Issue Resolved
                          </button>
                          {/* <button
                            onClick={handleTryAgain}
                            className={styles.tryAgainButton}
                          >
                            🔄 Try Again
                          </button>
                          <button
                            onClick={handleEscalateFromFollowUp}
                            className={styles.escalateButton}
                          >
                            🔺 Submit to Expert
                          </button> */}
                        </div>
                      </div>
                    )}
                  </div>

                
                </>
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  disabled={isQuerying}
                  selectedAsset={asset.name}
                  onClearAsset={() => {}}
                  placeholder={`Report ${asset.name}...`}
                />

               <div className={styles.escalationPrompt}>
                    <p>Can't resolve your issue?</p>
                    <button
                      onClick={() => setShowEscalation(true)}
                      className={styles.escalationButton}
                    >
                      🔺 Submit to Expert
                    </button>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escalation Form Modal */}
      {showEscalation && asset && (
        <EscalationForm
          assetId={asset.id}
          assetName={asset.name}
          contactName={asset.contactName}
          contactEmail={asset.contactEmail}
          contactPhone={asset.contactPhone}
          onClose={() => setShowEscalation(false)}
          onSubmit={handleEscalationSubmit}
        />
      )}
    </div>
  );
}
