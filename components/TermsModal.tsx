import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface PrivacyModalProps {
  visible: boolean;
  onProceed: () => void;
  onClose: () => void;
  isChecked: boolean;
  onToggleCheck: () => void
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ visible, onProceed, onClose, isChecked, onToggleCheck  }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (visible) {
      setHasScrolledToBottom(false);
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setHasScrolledToBottom(isBottom);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Terms and Conditions</Text>

          {/* Scrollable policy content */}
          <ScrollView
            style={styles.modalContent}
            onScroll={handleScroll}
            scrollEventThrottle={200}
            showsVerticalScrollIndicator={true}
            onContentSizeChange={(_, contentHeight) => {
              setCanScroll(contentHeight > 400);
            }}
          >
           <Text style={styles.sectionTitle}>Effective Date: 01/01/2025</Text>
            <Text style={styles.sectionText}>
            These Terms and Conditions ("Terms") govern your access to and use of the Voltage Training Club
            mobile application, website, and services (collectively, the "Platform") operated by Voltage Training
            Club Pty Ltd ("Voltage Training Club" or "VTC").{"\n"}{"\n"}
            By registering for, accessing, or using the Platform, you agree to be bound by these Terms. If you
            do not agree to these Terms, you may not use the Platform.
            </Text>

            <Text style={styles.sectionTitle}>1. Nature of the Platform</Text>
            <Text style={styles.sectionText}>
            Voltage Training Club is a technology service provider. The Platform facilitates connections
            between independent fitness professionals ("Trainers") and individuals seeking personal training
            services ("Clients").{"\n"}{"\n"}

            Voltage Training Club does not employ Trainers or endorse any specific training program or advice.
            The role of Voltage Training Club is strictly limited to providing the Platform through which
            Trainers may offer services directly to Clients. Voltage Training Club is not responsible for the
            quality, safety, legality, or efficacy of any services rendered by Trainers.{"\n"}{"\n"}
            While Voltage Training Club may make reasonable efforts to verify the identity, qualifications, and
            credentials of Trainers, we do not and cannot guarantee the accuracy, completeness, or currency of
            such information. Clients are encouraged to perform their own due diligence before engaging a
            Trainer.
            </Text>

            <Text style={styles.sectionTitle}>2. Trainer Obligations and Responsibilities</Text>
            <Text style={styles.sectionText}>
            By registering as a Trainer on the Platform, you acknowledge and agree that you:{"\n"}{"\n"}
            • Operate as an independent contractor and not as an employee, agent, or representative of Voltage Training Club.{"\n"}{"\n"}
            • Are solely responsible for maintaining all relevant and legally required qualifications, certifications, licenses, and registrations to offer personal training services in Australia.{"\n"}{"\n"}
            • Must hold and maintain adequate and current professional indemnity insurance and public liability insurance that covers services provided via the Platform.{"\n"}{"\n"}
            • Are solely responsible for your own tax obligations, superannuation, and business compliance matters.{"\n"}{"\n"}
            • Will ensure that all information provided on your Trainer profile is accurate, up-to-date, and not misleading.{"\n"}{"\n"}
            • Will comply with all applicable state and federal laws and regulations, including those related to health, fitness, safety, advertising, and consumer protection.
            </Text>

            <Text style={styles.sectionTitle}>3. Client Responsibilities and Acknowledgments</Text>
            <Text style={styles.sectionText}>
            By using the Platform as a Client, you agree and acknowledge that:{"\n"}{"\n"}
            • You are responsible for selecting a Trainer and verifying their credentials and qualifications before engaging their services.{"\n"}{"\n"}
            • You understand that all services are provided by independent Trainers and not by Voltage Training Club.{"\n"}{"\n"}
            • Voltage Training Club does not guarantee any particular outcomes or improvements in health, fitness, or performance.{"\n"}{"\n"}
            • Any disputes, dissatisfaction, injury, or harm experienced in connection with services rendered by a Trainer must be addressed directly with the Trainer.{"\n"}{"\n"}
            • You are participating in training programs voluntarily and at your own risk.
            </Text>

            <Text style={styles.sectionTitle}>4. Commission and Platform Fees</Text>
            <Text style={styles.sectionText}>
            Voltage Training Club provides the Platform at no upfront cost to Trainers. Instead, Voltage Training Club earns revenue by charging a flat-rate platform fee or commission on each transaction conducted via the Platform.{"\n"}{"\n"}
            Voltage Training Club reserves the right to modify its fee structure at any time, with reasonable notice provided to Trainers. Continued use of the Platform following notice constitutes acceptance of the revised fee structure.{"\n"}{"\n"}
            Trainers are prohibited from circumventing the Platform or conducting off-platform transactions with Clients introduced through the Platform for the purpose of avoiding fees.
            </Text>

            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
            To the maximum extent permitted by law, Voltage Training Club disclaims all liability for:{"\n"}{"\n"}
            • Any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to use of the Platform.{"\n"}{"\n"}
            • Any claims, losses, or liabilities arising from injury, illness, death, or damages incurred by a Client as a result of services rendered by a Trainer.{"\n"}{"\n"}
            • The actions or omissions of any Trainer or Client using the Platform.{"\n"}{"\n"}
            • The verification, accuracy, or completeness of any Trainer's qualifications, credentials, or representations.{"\n"}{"\n"}
            You acknowledge that Voltage Training Club is a neutral platform provider and does not supervise, direct, or control Trainers or their services.
            </Text>

            <Text style={styles.sectionTitle}>6. Platform Use and Prohibited Conduct</Text>
            <Text style={styles.sectionText}>
            You agree to use the Platform only for lawful purposes and in a manner consistent with these Terms.{"\n"}{"\n"}
            You must not:{"\n"}{"\n"}
            • Provide false, misleading, or deceptive information on your profile or in communications.{"\n"}{"\n"}
            • Upload content that is defamatory, obscene, abusive, or otherwise inappropriate.{"\n"}{"\n"}
            • Harass, threaten, stalk, or harm other users.{"\n"}{"\n"}
            • Introduce viruses, malware, or unauthorized code into the Platform.{"\n"}{"\n"}
            • Attempt to reverse engineer, duplicate, or exploit any portion of the Platform.{"\n"}{"\n"}
            • Use the Platform to facilitate illegal activities or transactions.{"\n"}{"\n"}
            Voltage Training Club reserves the right to suspend or terminate any account that violates these Terms or threatens the integrity of the Platform.
            </Text>

            <Text style={styles.sectionTitle}>7. No Guarantee of Availability or Success</Text>
            <Text style={styles.sectionText}>
            Voltage Training Club makes no representations about the availability, accuracy, or reliability of the platform or the services offered through it. We do not guarantee that Trainers will secure Clients or that Clients will achieve any particular fitness results.
            </Text>

            <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
            <Text style={styles.sectionText}>
            All intellectual property on the Platform, including trademarks, logos, software, text, graphics, and content, is owned by Voltage Training Club or its licensors. Users may not reproduce, modify, distribute, or use such materials without prior written permission.
            </Text>

            <Text style={styles.sectionTitle}>9. Privacy</Text>
            <Text style={styles.sectionText}>
            Use of the Platform is subject to the Voltage Training Club Privacy Policy, which outlines how personal information is collected, used, and stored.
            </Text>

            <Text style={styles.sectionTitle}>10. Modifications to Terms</Text>
            <Text style={styles.sectionText}>
            Voltage Training Club reserves the right to amend these Terms at any time. Updated Terms will be posted on the Platform with a revised effective date. Continued use of the Platform following such updates constitutes your agreement to be bound by the revised Terms.            
            </Text>

            <Text style={styles.sectionTitle}>11. Governing Law and Jurisdiction</Text>
            <Text style={styles.sectionText}>
            These Terms are governed by the laws of Victoria, Australia. Any disputes or claims arising out of or related to these Terms or the use of the Platform shall be resolved exclusively in the courts of Victoria.
            </Text>

            <Text style={styles.sectionTitle}>12. Contact Us</Text>
            <Text style={styles.sectionText}>
            For questions or concerns about these Terms, please contact:{"\n"}{"\n"}
            Voltage Training Club Pty Ltd{"\n"}{"\n"}
            <Text style={{ fontWeight: 'bold' }}>Email:  </Text>
            <Text style={{ fontWeight: 'bold',textDecorationLine: 'underline' }}>support@voltagetrainingclub.com {"\n"}</Text>
            </Text>
            
            <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              size={24}
              fillColor="#1abc9c"
              unFillColor="#FFFFFF"
              isChecked={isChecked}
              useBuiltInState={false}
              onPress={onToggleCheck}
              iconStyle={{ borderColor: '#ccc', borderRadius: 4 }}
              innerIconStyle={{ borderWidth: 2 }}
            />
            <Text style={styles.checkboxLabel}>I agree with the Terms and Conditions</Text>
          </View>
          </ScrollView>

        

          {/* Proceed Button */}
          <TouchableOpacity
            style={[
              styles.proceedButton,
              !(isChecked && hasScrolledToBottom) && { backgroundColor: '#ccc' },
            ]}
            disabled={!(isChecked  && hasScrolledToBottom)}
            onPress={onProceed}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '95%', // Increased height
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#888',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalContent: {
    height: 350,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
    marginTop: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    margin: '3%',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000', // fixed: black text
    marginLeft: 8,
    flex: 1,
  },
  proceedButton: {
    backgroundColor: '#1abc9c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
