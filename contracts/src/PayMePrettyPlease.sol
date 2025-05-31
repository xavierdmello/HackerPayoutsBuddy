// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract PayMePrettyPlease {
    struct Organization {
        string name;
        uint256 totalPayoutTime; // Sum of all payout times from hackathon end
        uint256 totalReviews;
        uint256 totalRating;
        uint256 lastReviewTimestamp;
        uint256 pendingPayouts;
        uint256 paidOutReviews;
    }

    struct Review {
        string organization;
        string eventName;
        string title;
        string comment;
        uint8 rating;
        string[] evidenceHashes;
        uint256 prizeAmount;
        bool prizePaidOut;
        uint256 hackathonEndDate;
        uint256 payoutDate;
        address reviewer;
        uint256 reviewId;
    }

    // State variables
    mapping(uint256 => Review) public reviews;
    mapping(string => Organization) public organizations;
    string[] public organizationNames; // Array to track organization names
    uint256 public reviewCount;

    // Events
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, string organization, string eventName);
    event PrizePaidOut(uint256 indexed reviewId, string organization, uint256 payoutTime);
    event DebugOrganizationSearch(string organization, uint256 count);

    function submitReview(
        string memory _organization,
        string memory _eventName,
        string memory _title,
        string memory _comment,
        uint8 _rating,
        string[] memory _evidenceHashes,
        uint256 _prizeAmount,
        uint256 _hackathonEndDate,
        bool _isAlreadyPaidOut,
        uint256 _payoutDate
    ) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
      
        uint256 reviewId = reviewCount++;
        
        // Update organization stats
        Organization storage org = organizations[_organization];
        if (org.totalReviews == 0) {
            // New organization, add to names array
            // Check if organization already exists in array (case-sensitive)
            bool exists = false;
            for (uint i = 0; i < organizationNames.length; i++) {
                if (keccak256(bytes(organizationNames[i])) == keccak256(bytes(_organization))) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                organizationNames.push(_organization);
            }
        }
        org.name = _organization;
        org.totalReviews++;
        org.totalRating += _rating;
        org.lastReviewTimestamp = block.timestamp;

        if (_isAlreadyPaidOut) {
            org.paidOutReviews++;
            org.totalPayoutTime += (_payoutDate - _hackathonEndDate);
        } else {
            org.pendingPayouts++;
        }
        
        reviews[reviewId] = Review({
            organization: _organization,
            eventName: _eventName,
            title: _title,
            comment: _comment,
            rating: _rating,
            evidenceHashes: _evidenceHashes,
            prizeAmount: _prizeAmount,
            prizePaidOut: _isAlreadyPaidOut,
            hackathonEndDate: _hackathonEndDate,
            payoutDate: _isAlreadyPaidOut ? _payoutDate : 0,
            reviewer: msg.sender,
            reviewId: reviewId
        });

        emit ReviewSubmitted(reviewId, msg.sender, _organization, _eventName);
    }

    function markPrizePaidOut(uint256 _reviewId) public {
        require(_reviewId < reviewCount, "Review does not exist");

        require(!reviews[_reviewId].prizePaidOut, "Prize already paid out");
        
        uint256 currentTimestamp = block.timestamp;
        uint256 payoutTime = currentTimestamp - reviews[_reviewId].hackathonEndDate;
        
        // Update organization stats
        Organization storage org = organizations[reviews[_reviewId].organization];
        org.totalPayoutTime += payoutTime;
        org.pendingPayouts--;
        org.paidOutReviews++;
        
        // Update review
        reviews[_reviewId].prizePaidOut = true;
        reviews[_reviewId].payoutDate = currentTimestamp;

        emit PrizePaidOut(_reviewId, reviews[_reviewId].organization, payoutTime);
    }

    // View functions
    function getReview(uint256 _reviewId) public view returns (Review memory) {
        require(_reviewId < reviewCount, "Review does not exist");
        return reviews[_reviewId];
    }

    function getOrganization(string memory _organization) public view returns (
        string memory name,
        uint256 avgPayoutTime,
        uint256 rating,
        uint256 totalReviews,
        uint256 lastReviewTimestamp,
        uint256 pendingPayouts,
        uint256 paidOutReviews
    ) {
        // Use exact organization name (case-sensitive)
        Organization storage org = organizations[_organization];
        return (
            org.name,
            org.paidOutReviews > 0 ? org.totalPayoutTime / org.paidOutReviews : 0,
            org.totalReviews > 0 ? org.totalRating / org.totalReviews : 0,
            org.totalReviews,
            org.lastReviewTimestamp,
            org.pendingPayouts,
            org.paidOutReviews
        );
    }

    function getAllReviewsFromSponsor(string memory _organization) public view returns (Review[] memory) {
        // First count how many reviews match (case-sensitive)
        uint256 matchCount = 0;
        uint256[] memory matchingIds = new uint256[](reviewCount);
        
        for (uint256 i = 0; i < reviewCount; i++) {
            if (keccak256(bytes(reviews[i].organization)) == keccak256(bytes(_organization))) {
                matchingIds[matchCount] = i;
                matchCount++;
            }
        }

        // Create array of exact size needed
        Review[] memory sponsorReviews = new Review[](matchCount);

        // Fill the array with matching reviews (case-sensitive)
        for (uint256 i = 0; i < matchCount; i++) {
            uint256 reviewId = matchingIds[i];
            Review memory review = reviews[reviewId];
            review.reviewId = reviewId;  // Store the actual review ID
            sponsorReviews[i] = review;
        }
        
        return sponsorReviews;
    }

    // New function to get all organizations
    function getAllOrganizations() public view returns (Organization[] memory) {
        Organization[] memory orgs = new Organization[](organizationNames.length);
        for (uint256 i = 0; i < organizationNames.length; i++) {
            orgs[i] = organizations[organizationNames[i]];
        }
        return orgs;
    }

    // New function to get organization names
    function getOrganizationNames() public view returns (string[] memory) {
        return organizationNames;
    }
}
