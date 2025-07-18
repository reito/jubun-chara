module Api
  module V1
    class TenantsController < ApplicationController
      def validate
        tenant = Tenant.find_by(slug: params[:slug])
        render json: { valid: tenant.present? }
      end

      def generate_invitation_link
        tenant = Tenant.find_by(slug: params[:tenant_slug])
        return render json: { error: 'Tenant not found' }, status: :not_found unless tenant

        token = SecureRandom.urlsafe_base64(32)
        expires_at = 24.hours.from_now

        # トークンをデータベースに保存
        invitation = tenant.invitations.create!(
          token: token,
          expires_at: expires_at
        )

        invitation_url = generate_invitation_url(token)
        render json: { invitation_url: invitation_url }
      end

      def validate_invitation
        invitation = Invitation.find_by(token: params[:token])
        
        if invitation && !invitation.expired? && !invitation.used?
          render json: { valid: true, tenant_slug: invitation.tenant.slug }
        else
          render json: { valid: false }
        end
      end

      private

      def generate_invitation_url(token)
        frontend_url = ENV['FRONTEND_URL'] || default_frontend_url
        "#{frontend_url}/invite/#{token}"
      end

      def default_frontend_url
        if Rails.env.development?
          "http://localhost:5173"
        else
          "https://jubun-chara-frontend.onrender.com"
        end
      end
    end
  end
end 