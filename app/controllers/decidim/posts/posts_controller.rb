# frozen_string_literal: true

# require_dependency "decidim/posts/application_controller"

module Decidim
  module Posts
    class PostsController < Decidim::Posts::ApplicationController
      include FormFactory
      include Flaggable
      include Decidim::AttachmentsHelper

      def index
        enforce_permission_to :read, :post

        @posts = Decidim::Posts::Post
                 .where(decidim_component_id: current_component.id)
                 .filter_category(params[:filter_post_category])
                 .order(created_at: :desc)
                 .includes(:attachments)
                 .limit(10)

        # @form = form(Decidim::Posts::PostForm).from_params(params, extra_context)
        # @meeting_form = meeting_form

        @meetings = if params[:filter_post_category].blank? || params[:filter_post_category] == 'calendar'
                meetings_component.blank? ? [] : Decidim::Meetings::Meeting.where(component: meetings_component).except_withdrawn
              else
                []
              end

        @fixed_objects = @posts.select(&:fixed).sort_by(&:created_at).reverse
        @non_fixed_posts = @posts.reject(&:fixed)
        @non_fixed_objects = (@non_fixed_posts + @meetings).sort_by(&:created_at).reverse
      end

      def show
        @post = Post.find(params[:id])

        enforce_permission_to :read, :post

        raise ActionController::RoutingError, "Not Found" unless @post
      end

      def new
        enforce_permission_to :create, :post
        @form = form(PostForm).from_params(post_creation_params)
      end

      def create
        enforce_permission_to :create, :post

        @form = form(PostForm).from_params(post_creation_params)

        CreatePost.call(@form) do
          on(:ok) do |post|
            flash[:notice] = I18n.t("posts.create.success", scope: "decidim.posts")
            # TODO: implement javascript to create a new post without reloading the page
            # redirect_to decidim.root_path
            # redirect_to current_component_path
            redirect_to posts_path
          end

          on(:invalid) do
            flash.now[:alert] = I18n.t("posts.create.invalid", scope: "decidim.posts")
            redirect_to posts_path
          end
        end
      end

      def edit
        @post = Post.find(params[:id])
        enforce_permission_to :edit, :post, post: @post
        @form = Decidim::Posts::PostForm.from_model(@post).with_context(context)
      end

      def update
        @post = Post.find(params[:id])
        enforce_permission_to :edit, :post, post: @post

        @form = form(PostForm).from_params(params)
        UpdatePost.call(@form, current_user, @post) do
          on(:ok) do |post|
            flash[:notice] = I18n.t("posts.update.success", scope: "decidim.posts")
            redirect_to posts_path
            # redirect_to Decidim::ResourceLocatorPresenter.new(@post).path
          end

          on(:invalid) do
            flash.now[:alert] = I18n.t("posts.update.invalid", scope: "decidim.posts")
            render :edit
          end
        end
      end

      def destroy
        @post = Post.find(params[:id])
        enforce_permission_to :delete, :post, post: @post

        DestroyPost.call(@post, current_user) do
          on(:ok) do
            flash[:notice] = I18n.t("posts.destroy.success", scope: "decidim.posts")
            redirect_to posts_path
          end

          on(:invalid) do
            flash.now[:alert] = I18n.t("posts.destroy.invalid", scope: "decidim.posts")
            redirect_to posts_path
          end
        end
      end

      def change_status
        @post = Decidim::Posts::Post.find(params[:id])

        #enforce_permission_to :change_post_status, post: @post

        if @post.update(status: params[:status], enable_comments: false)
          render json: { message: 'Status updated successfully', new_content: cell("decidim/posts/post_hv", @post).call(:show) }, status: :ok
        else
          render json: { error: 'Failed to update status' }, status: :unprocessable_entity
        end

      end

      private

      def post_creation_params
        params[:post]
      end

      def participatory_space
        @participatory_space ||= current_component.participatory_space
      end

      def meetings_component
        @meetings_component ||= participatory_space.components.find_by(manifest_name: "meetings")
      end

      # def meeting_form
      #   form(Decidim::Meetings::MeetingForm).from_params(params)
      # end

      def context
        {
          current_component: current_component,
          current_organization: current_component.organization,
          current_user:,
          current_participatory_space: participatory_space
        }
      end

    end
  end
end
