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
  const [agreeChecked, setAgreeChecked] = useState(false);
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

          <Text style={styles.modalTitle}>Privacy Policy</Text>

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
            Voltage Training Club Pty Ltd ("Voltage Training Club", "VTC", "we", "us", or "our") is committed
            to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use the Voltage Training Club mobile application, website,
            and associated services (collectively, the "Platform").{"\n"}{"\n"}
            By using the Platform, you agree to the terms of this Privacy Policy.
            </Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
            We may collect the following categories of information:
            </Text>

            <Text style={styles.sectionTitle}>1.1 Personal Information</Text>
            <Text style={styles.sectionText}>
            • Name{"\n"}{"\n"}
            • Email address{"\n"}{"\n"}
            • Phone number{"\n"}{"\n"}
            • Date of birth{"\n"}{"\n"}
            • Payment details (processed via third-party providers){"\n"}{"\n"}
            • Identity verification documents (for Trainers)
            </Text>

            <Text style={styles.sectionTitle}>1.2 Health & Fitness Data (Clients only)</Text>
            <Text style={styles.sectionText}>
            • Training goals and preferences{"\n"}{"\n"}
            • Medical history and injury information (if voluntarily provided)
            </Text>

            <Text style={styles.sectionTitle}>1.3 Technical Information</Text>
            <Text style={styles.sectionText}>
            • IP address{"\n"}{"\n"}
            • Device type and OS{"\n"}{"\n"}
            • App usage data{"\n"}{"\n"}
            • Browser type{"\n"}{"\n"}
            • Log data and crash reports
            </Text>

            <Text style={styles.sectionTitle}>1.4 Location Information</Text>
            <Text style={styles.sectionText}>
            • With your permission, we may collect approximate or precise location data to improve
            platform functionality
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
            We use your information to:{"\n"}{"\n"}
            • Facilitate connections between Trainers and Clients{"\n"}{"\n"}
            • Verify Trainer identity and qualifications{"\n"}{"\n"}
            • Provide, maintain, and improve our services{"\n"}{"\n"}
            • Communicate with you regarding your account, transactions, and support inquiries{"\n"}{"\n"}
            • Ensure platform safety, integrity, and compliance{"\n"}{"\n"}
            • Enforce our Terms and Conditions{"\n"}{"\n"}
            • Comply with legal obligations{"\n"}{"\n"}
            We do not sell your personal information to third parties.
            </Text>

            <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
            <Text style={styles.sectionText}>
            We may share your information with:{"\n"}{"\n"}
            
            <Text style={{ fontWeight: 'bold' }}>• Trainers or Clients</Text>  you interact with on the Platform{"\n"}{"\n"}
                       
            
            <Text style={{ fontWeight: 'bold' }}>• Third-party service providers</Text> who assist in payment processing, hosting, analytics, and communications{"\n"}{"\n"}
                      
            
            <Text style={{ fontWeight: 'bold' }}>• Regulatory or legal authorities</Text> if required by law or in response to valid legal requests{"\n"}{"\n"}
            
            
            <Text style={{ fontWeight: 'bold' }}> • Affiliates and successors</Text>  in the event of a company restructure, acquisition, or sale.
            
           
            </Text>

            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
            We implement appropriate technical and organizational measures to protect your personal data.
            However, no system is completely secure, and we cannot guarantee the absolute security of your
            information.
            </Text>

            <Text style={styles.sectionTitle}>5. Data Retention</Text>
            <Text style={styles.sectionText}>
            We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy
            Policy, unless a longer retention period is required or permitted by law.
            </Text>

            <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
            <Text style={styles.sectionText}>
            You may:{"\n"}{"\n"}
            • Access and update your personal information via your account{"\n"}{"\n"}
            • Request deletion of your data, subject to legal or contractual obligations{"\n"}{"\n"}
            • Opt out of marketing communications at any time{"\n"}{"\n"}
            To make a request, contact us at: <Text style={{ fontWeight: 'bold',textDecorationLine: 'underline' }}>support@voltagetrainingclub.com </Text>          
            </Text>

            <Text style={styles.sectionTitle}>7. Children’s Privacy</Text>
            <Text style={styles.sectionText}>
            The Platform is not intended for individuals under the age of 18. We do not knowingly collect
            personal data from children under 18. If we become aware of such data, we will delete it promptly.
            </Text>

            <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
            <Text style={styles.sectionText}>
            TYour information may be processed in countries outside of your country of residence, including
            Australia. By using the Platform, you consent to such transfers.
            </Text>

            <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. When we do, we will revise the "Effective
            Date" at the top. We encourage you to review the policy periodically.
            </Text>

            <Text style={styles.sectionTitle}>10. Contact Us</Text>
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
            <Text style={styles.checkboxLabel}>I agree with the Privacy Policy</Text>
          </View>
          </ScrollView>

        

          {/* Proceed Button */}
          <TouchableOpacity
            style={[
              styles.proceedButton,
              !(isChecked && hasScrolledToBottom) && { backgroundColor: '#ccc' },
            ]}
            disabled={!(isChecked && hasScrolledToBottom)}
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
