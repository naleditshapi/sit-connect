import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const AboutApp = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>About SitConnect</Text>

            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.text}>
                SitConnect is designed to bring together trusted house sitters and pet owners
                in a safe, reliable, and easy-to-use platform. Our mission is to make
                house sitting simple, secure, and convenient for everyone.
            </Text>

            <Text style={styles.sectionTitle}>What We Offer</Text>
            <Text style={styles.text}>
                • Verified profiles for sitters and owners{"\n"}
                • Easy browsing and matching{"\n"}
                • Seamless communication{"\n"}
                • A community built on trust and care
            </Text>

            <Text style={styles.sectionTitle}>Why SitConnect?</Text>
            <Text style={styles.text}>
                We believe in creating meaningful experiences between sitters, pet owners,
                and the pets they care for. SitConnect helps you feel confident knowing
                your home and pets are in good hands.
            </Text>

            <Text style={styles.footer}>© {new Date().getFullYear()} SitConnect. All rights reserved.</Text>
        </ScrollView>
    );
};

export default AboutApp;

// #region Styles
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 15,
    },
    text: {
        fontSize: 15,
        marginTop: 5,
        lineHeight: 22,
    },
    footer: {
        marginTop: 40,
        fontSize: 13,
        color: "#888",
        textAlign: "center",
    },
    // #endregion Styles
});
