package com.grainguard.config;

import com.grainguard.ai.rag.RagService;
import com.grainguard.entity.*;
import com.grainguard.entity.enums.Enums.*;
import com.grainguard.repository.*;
import com.grainguard.service.AnomalyEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GrainTypeRepository grainTypeRepository;

    @Autowired
    private GodownRepository godownRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private TransporterRepository transporterRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private EntitlementRuleRepository entitlementRuleRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @Autowired
    private GrainDispatchRepository grainDispatchRepository;

    @Autowired
    private GrainReceiptRepository grainReceiptRepository;

    @Autowired
    private DistributionTransactionRepository distributionTransactionRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private ShopRiskProfileRepository shopRiskProfileRepository;

    @Autowired
    private RagService ragService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AnomalyEngineService anomalyEngineService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Seed data already initialized
        }

        // 1. Seed Users
        User admin = userRepository.save(User.builder().name("System Admin").email("admin@grainguard.gov.in").phone("9876543210").passwordHash(passwordEncoder.encode("Admin@123")).role(UserRole.ADMIN).active(true).build());
        User officer = userRepository.save(User.builder().name("Officer Rajesh Verma").email("officer@grainguard.gov.in").phone("9876543211").passwordHash(passwordEncoder.encode("Officer@123")).role(UserRole.OFFICER).active(true).build());
        User fpsOwner = userRepository.save(User.builder().name("Suresh Patil (FPS102 Owner)").email("fps102@grainguard.gov.in").phone("9876543212").passwordHash(passwordEncoder.encode("Owner@123")).role(UserRole.FPS_OWNER).active(true).build());
        User transporter = userRepository.save(User.builder().name("Vikram Singh Transports").email("transporter@grainguard.gov.in").phone("9876543213").passwordHash(passwordEncoder.encode("Transporter@123")).role(UserRole.TRANSPORTER).active(true).build());
        User auditor = userRepository.save(User.builder().name("Senior Auditor Priya Nair").email("auditor@grainguard.gov.in").phone("9876543214").passwordHash(passwordEncoder.encode("Auditor@123")).role(UserRole.AUDITOR).active(true).build());

        // 2. Seed Grain Types
        GrainType rice = grainTypeRepository.save(GrainType.builder().name("RICE").unit("KG").description("Raw & Parboiled Super Fine Rice").build());
        GrainType wheat = grainTypeRepository.save(GrainType.builder().name("WHEAT").unit("KG").description("Sharbati Quality Wheat Grains").build());

        // 3. Seed Godowns
        Godown centralGodown = godownRepository.save(Godown.builder().godownCode("GOD-101").name("Central Grain Storage Godown #1").location("Sector 18, Industrial Area").district("Pune").capacity(100000.0).currentStatus("ACTIVE").build());
        Godown regionalGodown = godownRepository.save(Godown.builder().godownCode("GOD-102").name("Regional Storage Facility #2").location("MIDC Complex").district("Nashik").capacity(80000.0).currentStatus("ACTIVE").build());

        // 4. Seed Ration Shops
        RationShop shop101 = rationShopRepository.save(RationShop.builder().shopCode("FPS101").shopName("Anand Fair Price Store").ownerName("Anand Shinde").address("12 Station Road").district("Pune").state("Maharashtra").latitude(18.5204).longitude(73.8567).capacity(40000.0).currentStatus(ShopStatus.ACTIVE).assignedOfficer("Officer Rajesh Verma").build());
        RationShop shop102 = rationShopRepository.save(RationShop.builder().shopCode("FPS102").shopName("Saraswati Fair Price Store").ownerName("Suresh Patil").address("45 Market Yard").district("Pune").state("Maharashtra").latitude(18.5074).longitude(73.8077).capacity(50000.0).currentStatus(ShopStatus.UNDER_REVIEW).assignedOfficer("Officer Rajesh Verma").build());
        RationShop shop103 = rationShopRepository.save(RationShop.builder().shopCode("FPS103").shopName("Janta Ration Agency").ownerName("Mahesh Kale").address("78 MG Road").district("Nashik").state("Maharashtra").latitude(19.9975).longitude(73.7898).capacity(35000.0).currentStatus(ShopStatus.ACTIVE).assignedOfficer("Officer Rajesh Verma").build());

        // 5. Seed Transporters & Suppliers
        Transporter trans1 = transporterRepository.save(Transporter.builder().transporterCode("TR-201").name("Food Logistics Corp").companyName("FLC Logistics Ltd").vehicleNumber("MH-12-PQ-9988").phone("9822011223").status("ACTIVE").build());
        Supplier supp1 = supplierRepository.save(Supplier.builder().supplierCode("SUP-301").name("State Agricultural Procurement Corp").companyName("SAPC India Ltd").contactNumber("020-25671122").email("contact@sapc.gov.in").address("Agriculture Bhavan, Pune").status("ACTIVE").build());

        // 6. Seed Godown Inventory
        inventoryRepository.save(Inventory.builder().locationType(LocationType.GODOWN).locationId(centralGodown.getId()).grainTypeId(rice.getId()).quantity(45000.0).minimumThreshold(5000.0).build());
        inventoryRepository.save(Inventory.builder().locationType(LocationType.GODOWN).locationId(centralGodown.getId()).grainTypeId(wheat.getId()).quantity(30000.0).minimumThreshold(5000.0).build());
        inventoryRepository.save(Inventory.builder().locationType(LocationType.GODOWN).locationId(regionalGodown.getId()).grainTypeId(rice.getId()).quantity(25000.0).minimumThreshold(3000.0).build());

        // 7. Seed Shop Inventories
        inventoryRepository.save(Inventory.builder().locationType(LocationType.RATION_SHOP).locationId(shop101.getId()).grainTypeId(rice.getId()).quantity(3200.0).minimumThreshold(500.0).build());
        inventoryRepository.save(Inventory.builder().locationType(LocationType.RATION_SHOP).locationId(shop101.getId()).grainTypeId(wheat.getId()).quantity(1800.0).minimumThreshold(300.0).build());
        inventoryRepository.save(Inventory.builder().locationType(LocationType.RATION_SHOP).locationId(shop102.getId()).grainTypeId(rice.getId()).quantity(1000.0).minimumThreshold(800.0).build());
        inventoryRepository.save(Inventory.builder().locationType(LocationType.RATION_SHOP).locationId(shop102.getId()).grainTypeId(wheat.getId()).quantity(600.0).minimumThreshold(400.0).build());

        // 8. Seed Entitlement Rules
        entitlementRuleRepository.save(EntitlementRule.builder().rationCardType(RationCardType.AAY).grainTypeId(rice.getId()).quantityPerPerson(35.0).active(true).build());
        entitlementRuleRepository.save(EntitlementRule.builder().rationCardType(RationCardType.PHH).grainTypeId(rice.getId()).quantityPerPerson(5.0).active(true).build());
        entitlementRuleRepository.save(EntitlementRule.builder().rationCardType(RationCardType.NPHH).grainTypeId(rice.getId()).quantityPerPerson(2.0).active(true).build());

        // 9. Seed Beneficiaries
        Beneficiary b1 = beneficiaryRepository.save(Beneficiary.builder().beneficiaryCode("BEN-1001").name("Ramesh Kumar").dateOfBirth(LocalDate.of(1982, 5, 14)).gender("MALE").address("Flat 12, Labor Colony").district("Pune").state("Maharashtra").rationCardNumber("RC-AAY-889901").rationCardType(RationCardType.AAY).familySize(4).assignedShopId(shop102.getId()).status(BeneficiaryStatus.ACTIVE).build());
        familyMemberRepository.save(FamilyMember.builder().beneficiaryId(b1.getId()).name("Sunita Kumar").relationship("Wife").gender("FEMALE").dateOfBirth(LocalDate.of(1985, 8, 20)).build());

        Beneficiary b2 = beneficiaryRepository.save(Beneficiary.builder().beneficiaryCode("BEN-1002").name("Vijay Patil").dateOfBirth(LocalDate.of(1978, 11, 3)).gender("MALE").address("House 44, Ganj Peth").district("Pune").state("Maharashtra").rationCardNumber("RC-PHH-774412").rationCardType(RationCardType.PHH).familySize(5).assignedShopId(shop102.getId()).status(BeneficiaryStatus.ACTIVE).build());

        // 10. DEMO SCENARIO IMPLEMENTATION (Section 40)
        // Dispatch DISP-1002: Dispatched 5000 kg rice from Central Godown to FPS102
        GrainDispatch dispatch = grainDispatchRepository.save(GrainDispatch.builder()
                .dispatchCode("DISP-1002")
                .godownId(centralGodown.getId())
                .rationShopId(shop102.getId())
                .transporterId(trans1.getId())
                .grainTypeId(rice.getId())
                .quantityDispatched(5000.0)
                .dispatchDate(LocalDateTime.now().minusDays(3))
                .vehicleNumber("MH-12-PQ-9988")
                .status(DispatchStatus.PARTIALLY_RECEIVED)
                .createdBy("admin@grainguard.gov.in")
                .build());

        // Receipt RCPT-1002: Discrepancy recorded (Dispatched: 5000, Received: 4850, Shortage: 150 kg)
        GrainReceipt receipt = grainReceiptRepository.save(GrainReceipt.builder()
                .dispatchId(dispatch.getId())
                .quantityReceived(4850.0)
                .shortageQuantity(150.0)
                .receiptDate(LocalDateTime.now().minusDays(2))
                .receivedBy("fps102@grainguard.gov.in")
                .remarks("Transit shortage recorded at shop unloading. Physical weighbridge difference.")
                .status(ReceiptStatus.DISCREPANCY_FLAGGED)
                .build());

        // Historical & Current Month High Distribution Transactions for FPS102 (Totaling 7800 KG vs 4500 KG baseline)
        distributionTransactionRepository.save(DistributionTransaction.builder().transactionCode("TX-DIST-101").beneficiaryId(b1.getId()).rationShopId(shop102.getId()).grainTypeId(rice.getId()).quantity(35.0).operatorId("fps102@grainguard.gov.in").distributionDate(LocalDateTime.now().minusDays(1)).status("COMPLETED").build());
        distributionTransactionRepository.save(DistributionTransaction.builder().transactionCode("TX-DIST-102").beneficiaryId(b2.getId()).rationShopId(shop102.getId()).grainTypeId(rice.getId()).quantity(7765.0).operatorId("fps102@grainguard.gov.in").distributionDate(LocalDateTime.now().minusDays(1)).status("COMPLETED").build());

        // Trigger Anomaly Engine to generate stock discrepancy and distribution volume alerts
        anomalyEngineService.evaluateStockDiscrepancy(dispatch, receipt);
        anomalyEngineService.evaluateDistributionDeviation(shop102.getId());

        // 11. Seed Policy Knowledge Documents for RAG
        ragService.ingestDocument(
                "PDS Standard Operating Procedure 2024",
                "PDS_SOP_2024.txt",
                "TXT",
                "PDS_CIRCULAR",
                "Ministry of Consumer Affairs, Food & Public Distribution",
                "v2024.1",
                "PUBLIC DISTRIBUTION SYSTEM (PDS) INSPECTION & AUDIT POLICY MANUAL\n\n" +
                "Section 1: Inventory Reconciliation & Transit Shortages\n" +
                "1.1 Transit shortages occurring between Central Storage Godowns and Fair Price Shops (FPS) must be recorded immediately upon delivery.\n" +
                "1.2 Any shortage exceeding 1.0% of total dispatched quantity (or 50 KG, whichever is lower) must automatically flag the shipment as DISCREPANCY_FLAGGED.\n" +
                "1.3 The District Supply Officer (DSO) or authorized inspecting officer must conduct an on-site physical verification of shop weighbridge calibration within 7 working days of receipt of alert.\n\n" +
                "Section 2: Distribution Baseline Deviation & Risk Scoring\n" +
                "2.1 Monthly grain distribution volumes for every FPS are monitored against historical 6-month moving baselines.\n" +
                "2.2 If monthly distribution exceeds 50% above historical baseline without prior sanctioned allotment quota revision, an automated DISTRIBUTION_ANOMALY alert is generated.\n" +
                "2.3 High-severity alerts increase the shop's AI Risk Indicator Score. Authorized human officers must perform human-in-the-loop audit reviews before sanctioning subsequent allocation quotas.",
                LocalDate.of(2024, 1, 15)
        );

        System.out.println("====================================================================");
        System.out.println(" GrainGuard AI Demo Seed Data & Demo Scenario Initialized Successfully!");
        System.out.println(" Demo Users:");
        System.out.println("   ADMIN       : admin@grainguard.gov.in / Admin@123");
        System.out.println("   OFFICER     : officer@grainguard.gov.in / Officer@123");
        System.out.println("   FPS_OWNER   : fps102@grainguard.gov.in / Owner@123");
        System.out.println("   TRANSPORTER : transporter@grainguard.gov.in / Transporter@123");
        System.out.println("   AUDITOR     : auditor@grainguard.gov.in / Auditor@123");
        System.out.println("====================================================================");
    }
}
